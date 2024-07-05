import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import generateStockHandoverNumber from '../../lib/stockHandoverNumberGenerator'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const createStockRequestDal = async (req: Request) => {
	const { category, subcategory, brand, inventory, emp_id, emp_name, allotted_quantity, auth, unit } = req.body

	const ulb_id = auth?.ulb_id

	try {
		if (!ulb_id) {
			throw { error: true, message: 'Login invalid, Please login again' }
		}

		const invData = await prisma.inventory.findFirst({
			where: {
				id: inventory,
			},
			select: {
				quantity: true,
			},
		})

		const invBuffer: any = await prisma.inventory_buffer.aggregate({
			where: {
				inventoryId: inventory,
			},
			_sum: {
				reserved_quantity: true,
			},
		})

		if (Number(allotted_quantity) > (Number(invData?.quantity) - invBuffer?._sum?.reserved_quantity || 0)) {
			throw { error: true, message: `Allotted quantity cannot be more than the available stock. Available stock : ${Number(invData?.quantity) - invBuffer?._sum?.reserved_quantity || 0} ` }
		}

		const stock_handover_no = generateStockHandoverNumber(ulb_id)

		const data: any = {
			...(category && { category: { connect: { id: category } } }),
			subcategory: { connect: { id: subcategory } },
			brand: { connect: { id: brand } },
			...(unit && { unit: { connect: { id: unit } } }),
			inventory: { connect: { id: inventory } },
			emp_id: emp_id,
			emp_name: emp_name,
			stock_handover_no: stock_handover_no,
			allotted_quantity: Number(allotted_quantity),
			ulb_id: ulb_id,
			status: 0,
		}

		let stockReq: any

		//start transaction
		await prisma.$transaction(async tx => {
			stockReq = await tx.stock_request.create({
				data: data,
			})

			await tx.dist_stock_req_inbox.create({
				data: {
					stock_handover_no: stock_handover_no,
				},
			})

			await tx.inventory_buffer.create({
				data: {
					stock_handover_no: stock_handover_no,
					reserved_quantity: allotted_quantity,
					inventory: { connect: { id: inventory } },
				},
			})
		})

		return stockReq
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const getStockReqInboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: any = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]
	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				stock_handover_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				emp_id: {
					description: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	if (category[0] || subcategory[0] || brand[0]) {
		whereClause.AND = [
			...(category[0]
				? [
						{
							stock_request: {
								category_masterId: {
									in: category,
								},
							},
						},
					]
				: []),
			...(subcategory[0]
				? [
						{
							stock_request: {
								subcategory_masterId: {
									in: subcategory,
								},
							},
						},
					]
				: []),
			...(brand[0]
				? [
						{
							stock_request: {
								brand_masterId: {
									in: brand,
								},
							},
						},
					]
				: []),
			...(status[0]
				? [
						{
							stock_request: {
								status: {
									in: status.map(Number),
								},
							},
						},
					]
				: []),
		]
	}

	try {
		count = await prisma.dist_stock_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.dist_stock_req_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				stock_handover_no: true,
				stock_request: {
					select: {
						stock_handover_no: true,
						category: {
							select: {
								name: true,
							},
						},
						subcategory: {
							select: {
								name: true,
							},
						},
						brand: {
							select: {
								name: true,
							},
						},
						unit: {
							select: {
								name: true,
							},
						},
						ulb_id: true,
						emp_id: true,
						emp_name: true,
						allotted_quantity: true,
						isEdited: true,
						status: true,
						serial_no: true,
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.stock_request }
			delete item.stock_request
			resultToSend.push({ ...item, ...temp })
		})

		totalPage = Math.ceil(count / take)
		if (endIndex < count) {
			pagination.next = {
				page: page + 1,
				take: take,
			}
		}
		if (startIndex > 0) {
			pagination.prev = {
				page: page - 1,
				take: take,
			}
		}
		pagination.currentPage = page
		pagination.currentTake = take
		pagination.totalPage = totalPage
		pagination.totalResult = count
		return {
			data: resultToSend,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getStockReqOutboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: any = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]
	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				stock_handover_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				emp_id: {
					description: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	if (category[0] || subcategory[0] || brand[0]) {
		whereClause.AND = [
			...(category[0]
				? [
						{
							stock_request: {
								category_masterId: {
									in: category,
								},
							},
						},
					]
				: []),
			...(subcategory[0]
				? [
						{
							stock_request: {
								subcategory_masterId: {
									in: subcategory,
								},
							},
						},
					]
				: []),
			...(brand[0]
				? [
						{
							stock_request: {
								brand_masterId: {
									in: brand,
								},
							},
						},
					]
				: []),
			...(status[0]
				? [
						{
							stock_request: {
								status: {
									in: status.map(Number),
								},
							},
						},
					]
				: []),
		]
	}

	try {
		count = await prisma.dist_stock_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.dist_stock_req_outbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				stock_handover_no: true,
				stock_request: {
					select: {
						stock_handover_no: true,
						category: {
							select: {
								name: true,
							},
						},
						subcategory: {
							select: {
								name: true,
							},
						},
						brand: {
							select: {
								name: true,
							},
						},
						unit: {
							select: {
								name: true,
							},
						},
						ulb_id: true,
						emp_id: true,
						emp_name: true,
						allotted_quantity: true,
						isEdited: true,
						status: true,
						serial_no: true,
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.stock_request }
			delete item.stock_request
			resultToSend.push({ ...item, ...temp })
		})

		totalPage = Math.ceil(count / take)
		if (endIndex < count) {
			pagination.next = {
				page: page + 1,
				take: take,
			}
		}
		if (startIndex > 0) {
			pagination.prev = {
				page: page - 1,
				take: take,
			}
		}
		pagination.currentPage = page
		pagination.currentTake = take
		pagination.totalPage = totalPage
		pagination.totalResult = count
		return {
			data: resultToSend,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const forwardToSrDal = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string[] } = req.body

	try {
		await Promise.all(
			stock_handover_no.map(async (item: string) => {
				const status: any = await prisma.stock_request.findFirst({
					where: {
						stock_handover_no: item,
					},
					select: {
						status: true,
					},
				})
				if (status?.status < -1 || status?.status > 0) {
					throw { error: true, message: 'Stock request is not valid to be forwarded' }
				}
				const statusChecker = (status: number) => {
					if (status === 0) {
						return 2
					} else {
						return 1
					}
				}
				const srOutbox: any = await prisma.dist_stock_req_outbox.count({
					where: {
						stock_handover_no: item,
					},
				})

				const statusToUpdate = statusChecker(Number(status?.status))
				await prisma.$transaction([
					prisma.dist_stock_req_outbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.sr_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.stock_request.update({
						where: {
							stock_handover_no: item,
						},
						data: {
							status: statusToUpdate,
						},
					}),
					prisma.dist_stock_req_inbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					...(srOutbox !== 0
						? [
								prisma.sr_stock_req_outbox.delete({
									where: {
										stock_handover_no: item,
									},
								}),
							]
						: []),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_SR),
							title: 'New stock request',
							destination: 13,
							description: `There is a new stock request to be approved  : ${item}`,
						},
					}),
				])
			})
		)
		return 'Forwarded'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const handoverDal = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string } = req.body

	try {
		const status: any = await prisma.stock_request.findFirst({
			where: {
				stock_handover_no: stock_handover_no,
			},
			select: {
				status: true,
			},
		})
		if (status?.status < 3) {
			throw { error: true, message: 'Stock request is not valid to be handed over' }
		}

		await prisma.$transaction(async tx => {
			await tx.stock_request.update({
				where: {
					stock_handover_no: stock_handover_no,
				},
				data: {
					status: 4,
				},
			})
		})

		return 'Handed over'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const stockReturnDal = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string } = req.body

	try {
		const status: any = await prisma.stock_request.findFirst({
			where: {
				stock_handover_no: stock_handover_no,
			},
			select: {
				status: true,
			},
		})
		if (status?.status < 3) {
			throw { error: true, message: 'Stock request is not valid to be returned to inventory' }
		}

		await prisma.$transaction(async tx => {
			await tx.dist_stock_req_outbox.create({
				data: { stock_handover_no: stock_handover_no },
			})

			await tx.sr_stock_req_inbox.create({
				data: { stock_handover_no: stock_handover_no },
			})

			await tx.stock_request.update({
				where: {
					stock_handover_no: stock_handover_no,
				},
				data: {
					status: 5,
				},
			})

			await tx.dist_stock_req_inbox.delete({
				where: {
					stock_handover_no: stock_handover_no,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_SR),
					title: 'A stock to be returned',
					destination: 13,
					description: `There is a stock to be returned  : ${stock_handover_no}`,
				},
			})
		})

		return 'Forwarded to SR for approval'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const AddDeadStockDal = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string } = req.body

	try {
		const status: any = await prisma.stock_request.findFirst({
			where: {
				stock_handover_no: stock_handover_no,
			},
			select: {
				status: true,
			},
		})
		if (status?.status < 3) {
			throw { error: true, message: 'Stock request is not valid to be added to dead stock' }
		}

		await prisma.$transaction(async tx => {
			await tx.dist_stock_req_outbox.create({
				data: { stock_handover_no: stock_handover_no },
			})

			await tx.sr_stock_req_inbox.create({
				data: { stock_handover_no: stock_handover_no },
			})

			await tx.stock_request.update({
				where: {
					stock_handover_no: stock_handover_no,
				},
				data: {
					status: 6,
				},
			})

			await tx.dist_stock_req_inbox.delete({
				where: {
					stock_handover_no: stock_handover_no,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_SR),
					title: 'A stock to be added to dead stock',
					destination: 13,
					description: `There is a stock to be added to dead stock  : ${stock_handover_no}`,
				},
			})
		})

		return 'Forwarded to SR for approval'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const warrantyClaimReqDal = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string } = req.body

	try {
		const stockReq = await prisma.stock_request.findFirst({
			where: {
				stock_handover_no: stock_handover_no,
			},
			select: {
				status: true,
				inventory: {
					select: {
						warranty: true,
					},
				},
			},
		})
		if (!stockReq) {
			throw { error: true, message: 'Invalid stock request' }
		}
		if (stockReq?.status < 3) {
			throw { error: true, message: 'Stock request is not valid to be claimed for warranty' }
		}
		if (!stockReq?.inventory?.warranty) {
			throw { error: true, message: 'The item has no option to claim warranty' }
		}

		const srOutbox = await prisma.sr_stock_req_outbox.count({
			where: {
				stock_handover_no: stock_handover_no,
			},
		})

		await prisma.$transaction(async tx => {
			await tx.dist_stock_req_outbox.create({
				data: { stock_handover_no: stock_handover_no },
			})

			await tx.sr_stock_req_inbox.create({
				data: { stock_handover_no: stock_handover_no },
			})

			await tx.stock_request.update({
				where: {
					stock_handover_no: stock_handover_no,
				},
				data: {
					status: 71,
				},
			})

			await tx.dist_stock_req_inbox.delete({
				where: {
					stock_handover_no: stock_handover_no,
				},
			})

			if (srOutbox !== 0) {
				await tx.sr_stock_req_outbox.delete({
					where: {
						stock_handover_no: stock_handover_no,
					},
				})
			}

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_SR),
					title: 'A warranty claim request',
					destination: 13,
					description: `There is a new warranty claim request having stock request number : ${stock_handover_no}`,
				},
			})
		})

		return 'Forwarded to SR for approval'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

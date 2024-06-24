import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import generateStockHandoverNumber from '../../lib/stockHandoverNumberGenerator'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const createStockRequestDal = async (req: Request) => {
	const { category, subcategory, brand, inventory, emp_id, allotted_quantity, auth } = req.body

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

		if (Number(allotted_quantity) > Number(invData?.quantity)) {
			throw { error: true, message: 'Allotted quantity cannot be more than the available stock' }
		}

		const stock_handover_no = generateStockHandoverNumber(ulb_id)

		const data: any = {
			category: { connect: { id: category } },
			subcategory: { connect: { id: subcategory } },
			brand: { connect: { id: brand } },
			inventory: { connect: { id: inventory } },
			emp_id: emp_id,
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
						ulb_id: true,
						allotted_quantity: true,
						isEdited: true,
						status: true,
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
						ulb_id: true,
						allotted_quantity: true,
						isEdited: true,
						status: true,
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

export const getPreProcurementOutboxDal = async (req: Request) => {
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
	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				procurement_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				procurement: {
					description: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	//creating filter options for the query
	if (category[0]) {
		whereClause.procurement = {
			category_masterId: {
				in: category,
			},
		}
	}
	if (subcategory[0]) {
		whereClause.procurement = {
			subcategory_masterId: {
				in: subcategory,
			},
		}
	}
	if (status[0]) {
		whereClause.procurement = {
			status: {
				in: status.map(Number),
			},
		}
	}
	if (brand[0]) {
		whereClause.procurement = {
			brand_masterId: {
				in: brand,
			},
		}
	}
	whereClause.NOT = [
		{
			procurement: {
				status: {
					status: -2,
				},
			},
		},
		{
			procurement: {
				status: {
					status: 2,
				},
			},
		},
	]

	try {
		count = await prisma.sr_pre_procurement_outbox.count({
			where: whereClause,
		})
		const result = await prisma.sr_pre_procurement_outbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				procurement_no: true,
				procurement: {
					select: {
						procurement_no: true,
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
						description: true,
						quantity: true,
						rate: true,
						total_rate: true,
						isEdited: true,
						remark: true,
						status: {
							select: {
								status: true,
							},
						},
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.procurement }
			delete item.procurement
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

export const getPreProcurementOutboxByIdDal = async (req: Request) => {
	const { id } = req.params
	try {
		const result: any = await prisma.sr_pre_procurement_outbox.findFirst({
			where: {
				id: id,
			},
			select: {
				id: true,
				procurement_no: true,
				procurement: {
					select: {
						procurement_no: true,
						category: {
							select: {
								id: true,
								name: true,
							},
						},
						subcategory: {
							select: {
								id: true,
								name: true,
							},
						},
						brand: {
							select: {
								id: true,
								name: true,
							},
						},
						description: true,
						quantity: true,
						rate: true,
						total_rate: true,
						isEdited: true,
						remark: true,
						status: {
							select: {
								status: true,
							},
						},
					},
				},
			},
		})

		let resultToSend: any = {}

		const temp = { ...result?.procurement }
		delete result.procurement
		resultToSend = { ...result, ...temp }

		return resultToSend
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getPreProcurementRejectedDal = async (req: Request) => {
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
	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				procurement_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				procurement: {
					description: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	//creating filter options for the query
	if (category[0]) {
		whereClause.procurement = {
			category_masterId: {
				in: category,
			},
		}
	}
	if (subcategory[0]) {
		whereClause.procurement = {
			subcategory_masterId: {
				in: subcategory,
			},
		}
	}
	if (status[0]) {
		whereClause.procurement = {
			status: {
				in: status.map(Number),
			},
		}
	}
	if (brand[0]) {
		whereClause.procurement = {
			brand_masterId: {
				in: brand,
			},
		}
	}
	whereClause.procurement = {
		status: {
			status: -2,
		},
	}

	try {
		count = await prisma.sr_pre_procurement_inbox.count({
			where: whereClause,
		})
		const result = await prisma.sr_pre_procurement_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				procurement_no: true,
				procurement: {
					select: {
						procurement_no: true,
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
						description: true,
						quantity: true,
						rate: true,
						total_rate: true,
						isEdited: true,
						remark: true,
						status: {
							select: {
								status: true,
							},
						},
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.procurement }
			delete item.procurement
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

export const getPreProcurementReleasedDal = async (req: Request) => {
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
	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				procurement_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				procurement: {
					description: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	//creating filter options for the query
	if (category[0]) {
		whereClause.procurement = {
			category_masterId: {
				in: category,
			},
		}
	}
	if (subcategory[0]) {
		whereClause.procurement = {
			subcategory_masterId: {
				in: subcategory,
			},
		}
	}
	if (status[0]) {
		whereClause.procurement = {
			status: {
				in: status.map(Number),
			},
		}
	}
	if (brand[0]) {
		whereClause.procurement = {
			brand_masterId: {
				in: brand,
			},
		}
	}
	whereClause.procurement = {
		status: {
			status: 2,
		},
	}

	try {
		count = await prisma.sr_pre_procurement_inbox.count({
			where: whereClause,
		})
		const result = await prisma.sr_pre_procurement_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				procurement_no: true,
				procurement: {
					select: {
						procurement_no: true,
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
						description: true,
						quantity: true,
						rate: true,
						total_rate: true,
						isEdited: true,
						remark: true,
						status: {
							select: {
								status: true,
							},
						},
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.procurement }
			delete item.procurement
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

export const editPreProcurementDal = async (req: Request) => {
	const { procurement_no, category, subcategory, brand, description, rate, quantity, total_rate, remark } = req.body

	const data = {
		category: { connect: { id: category } },
		subcategory: { connect: { id: subcategory } },
		brand: { connect: { id: brand } },
		description: description,
		rate: Number(rate),
		quantity: Number(quantity),
		total_rate: Number(total_rate),
		isEdited: true,
		remark: remark,
	}
	if (Number(rate) && Number(quantity)) {
		if (Number(rate) * Number(quantity) !== Number(total_rate)) {
			return { error: true, message: 'The calculation result for total rate is invalid' }
		}
	}

	const procurement: any = await prisma.procurement.findFirst({
		where: {
			procurement_no: procurement_no,
		},
		include: {
			status: true,
		},
	})
	const tempStatus = Number(procurement?.status?.status)

	const tempData: any = {
		procurement_no: procurement_no,
		category: { connect: { id: procurement?.category_masterId } },
		subcategory: { connect: { id: procurement?.subcategory_masterId } },
		brand: { connect: { id: procurement?.brand_masterId } },
		description: procurement?.description,
		rate: procurement?.rate,
		quantity: procurement?.quantity,
		total_rate: procurement?.total_rate,
		remark: procurement?.remark,
		isEdited: procurement?.isEdited,
		status: tempStatus,
	}

	const historyExistence = await prisma.procurement_history.count({
		where: {
			procurement_no: procurement_no,
		},
	})

	try {
		await prisma.$transaction([
			...(historyExistence === 0
				? [
						prisma.procurement_history.create({
							data: tempData,
						}),
					]
				: []),
			prisma.procurement.update({
				where: {
					procurement_no: procurement_no,
				},
				data: data,
			}),
			// prisma.da_pre_procurement_outbox.update({
			//     where: {
			//         procurement_no: procurement_no
			//     },
			//     data:
			// }),
			// prisma.pre_procurement_history.update({
			//     where: {
			//         procurement_no: procurement_no
			//     },
			//     data: data
			// })
		])
		return 'Edited'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

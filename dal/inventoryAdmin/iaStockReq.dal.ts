import { Request } from 'express'
import { PrismaClient, Prisma } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

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
		count = await prisma.ia_stock_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.ia_stock_req_inbox.findMany({
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
						inventory: {
							select: {
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
							},
						},
						ulb_id: true,
						emp_id: true,
						emp_name: true,
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
		count = await prisma.ia_stock_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.ia_stock_req_outbox.findMany({
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
						inventory: {
							select: {
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
							},
						},
						ulb_id: true,
						emp_id: true,
						emp_name: true,
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

export const approveStockReqDal = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string[] } = req.body

	try {
		await Promise.all(
			stock_handover_no.map(async (item: string) => {
				const stockReq = await prisma.stock_request.findFirst({
					where: { stock_handover_no: item },
					select: {
						allotted_quantity: true,
						inventoryId: true,
						status: true,
						inventory: {
							select: {
								subcategory: {
									select: {
										name: true,
									},
								},
							},
						},
						stock_req_product: true,
					},
				})

				if (!stockReq) {
					throw { error: true, message: 'Invalid stock handover' }
				}

				if (stockReq?.status !== 1 && stockReq?.status !== 80) {
					throw { error: true, message: 'Stock request is not valid to be approved' }
				}

				const products: any[] = await prisma.$queryRawUnsafe(
					`
						SELECT *
						FROM product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
						WHERE is_available = true AND inventory_id = '${stockReq?.inventoryId as string}'
						LIMIT ${stockReq?.allotted_quantity as Number}
						`
				)

				if (products.length === 0) {
					throw { error: true, message: 'No product available' }
				}

				if (products.length !== Number(stockReq?.allotted_quantity)) {
					throw { error: true, message: 'Insufficient quantity' }
				}

				await prisma.$transaction(async tx => {
					await Promise.all(
						products.map(async product => {
							await tx.$queryRawUnsafe(`
							UPDATE product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
							SET is_available = false
							WHERE serial_no = '${product?.serial_no as string}'
						`)
							tx.stock_req_product.create({
								data: {
									stock_handover_no: item,
									serial_no: product?.serial_no as string,
									inventoryId: stockReq?.inventoryId as string,
								},
							})
						})
					)
					await tx.stock_request.update({
						where: {
							stock_handover_no: item,
						},
						data: {
							status: 3,
						},
					})
					await tx.ia_stock_req_outbox.create({
						data: { stock_handover_no: item },
					})
					await tx.dist_stock_req_inbox.create({
						data: { stock_handover_no: item },
					})
					await tx.da_stock_req_inbox.create({
						data: { stock_handover_no: item },
					})
					await tx.inventory.update({
						where: { id: stockReq?.inventoryId as string },
						data: {
							quantity: {
								decrement: Number(stockReq?.allotted_quantity),
							},
						},
					})
					await tx.ia_stock_req_inbox.delete({
						where: {
							stock_handover_no: item,
						},
					})
					await tx.dist_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					})
					await tx.da_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					})
					await tx.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DIST),
							title: 'Stock approved',
							destination: 40,
							description: `stock request : ${item} has approved`,
						},
					})
					await tx.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DA),
							title: 'Stock approved',
							destination: 25,
							description: `stock request : ${item} has approved`,
						},
					})
				})
			})
		)
		return 'Approved'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const returnStockReqDal = async (req: Request) => {
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
				if (status?.status < 1 || status?.status > 2) {
					throw { error: true, message: 'Stock request is not valid to be returned' }
				}

				await prisma.$transaction([
					prisma.ia_stock_req_outbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.dist_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.da_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.stock_request.update({
						where: {
							stock_handover_no: item,
						},
						data: {
							status: -1,
						},
					}),
					prisma.ia_stock_req_inbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.dist_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.da_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DIST),
							title: 'Stock returned',
							destination: 40,
							description: `stock request : ${item} has returned`,
						},
					}),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DA),
							title: 'Stock returned',
							destination: 25,
							description: `stock request : ${item} has returned`,
						},
					}),
				])
			})
		)
		return 'Returned'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const rejectStockReqDal = async (req: Request) => {
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
				if (status?.status < 1 || status?.status > 2) {
					throw { error: true, message: 'Stock request is not valid to be rejected' }
				}

				await prisma.$transaction([
					prisma.ia_stock_req_outbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.dist_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.da_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.stock_request.update({
						where: {
							stock_handover_no: item,
						},
						data: {
							status: -2,
						},
					}),
					prisma.ia_stock_req_inbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.dist_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.dist_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.da_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DIST),
							title: 'Stock rejected',
							destination: 40,
							description: `stock request : ${item} has rejected`,
						},
					}),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DA),
							title: 'Stock rejected',
							destination: 25,
							description: `stock request : ${item} has rejected`,
						},
					}),
				])
			})
		)
		return 'Returned'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

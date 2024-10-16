import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const getTotalStocksDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from = req?.query?.from//yyyy-mm-dd
	const to = req?.query?.to//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.inventoryWhereInput = {}
	const dataToSend: any[] = []

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				description: {
					contains: search,
					mode: 'insensitive',
				},
			}
		]
	}

	if (category[0] || subcategory[0]) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						category_masterId: {
							in: category,
						},

					},
				]
				: []),
			...(subcategory[0]
				? [
					{
						subcategory_masterId: {
							in: subcategory,
						},
					},
				]
				: [])
		]
	}

	try {
		count = await prisma.inventory.count({
			where: whereClause,
		})
		const result = await prisma.inventory.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				category: {
					select: {
						id: true,
						name: true
					}
				},
				subcategory: {
					select: {
						id: true,
						name: true
					}
				},
				unit: {
					select: {
						id: true,
						name: true,
						abbreviation: true
					}
				},
				description: true,
				// quantity: true,
				warranty: true,
				supplier_master: true
			},
		})

		await Promise.all(
			result.map(async (item: any, index: number) => {
				const products: any[] = await prisma.$queryRawUnsafe(`
					SELECT sum(opening_quantity) as opening_quantity, serial_no,brand,quantity,opening_quantity,is_available,procurement_stock_id,updatedat
					FROM product.product_${item?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
					WHERE inventory_id = '${item?.id}'
					${from && to ? `and updatedat between '${from}' and '${to}'` : ''}
					group by serial_no,brand,quantity,opening_quantity,is_available,procurement_stock_id,updatedat
					`)

				const productsTotal: any[] = await prisma.$queryRawUnsafe(`
						SELECT sum(opening_quantity) as opening_quantity
						FROM product.product_${item?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
						WHERE inventory_id = '${item?.id}'
						${from && to ? `and updatedat between '${from}' and '${to}'` : ''}
						`)

				const stockReq = await prisma.stock_req_product.aggregate({
					where: {
						inventoryId: item?.id
					},
					_sum: {
						quantity: true
					}
				})

				if (products.length !== 0) {
					// item.opening_quantity = products[0]?.opening_quantity
					item.products = products
					const deadStock = await prisma.inventory_dead_stock.aggregate({
						where: {
							inventoryId: item?.id
						},
						_sum: {
							quantity: true
						}
					})
					item.dead_stock = deadStock?._sum?.quantity
					item.total_quantity = Number(productsTotal[0]?.opening_quantity) + Number(deadStock?._sum?.quantity) + Number(stockReq?._sum.quantity)
					item.quantity = Number(productsTotal[0]?.opening_quantity)
					dataToSend.push(item)
				} else {
					count = count - 1
				}
			})
		)

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
			data: dataToSend,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getDeadStocksDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.inventory_dead_stockWhereInput = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				inventory: {
					description: {
						contains: search,
						mode: 'insensitive',
					}
				},
			}
		]
	}

	if (category[0] || subcategory[0] || from || to) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						inventory: {
							category_masterId: {
								in: category,
							},
						}

					},
				]
				: []),
			...(subcategory[0]
				? [
					{
						inventory: {
							subcategory_masterId: {
								in: subcategory,
							},
						}
					},
				]
				: []),
			...(from && to
				? [
					{
						createdAt: {
							gte: new Date(from),
							lte: new Date(to)
						}
					}
				]
				: []),
		]
	}


	try {
		count = await prisma.inventory_dead_stock.count({
			where: whereClause,
		})
		const result = await prisma.inventory_dead_stock.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				serial_no: true,
				remark1: true,
				remark2: true,
				quantity: true,
				inventory: {
					select: {
						category: {
							select: {
								id: true,
								name: true
							}
						},
						subcategory: {
							select: {
								id: true,
								name: true
							}
						},
						unit: {
							select: {
								id: true,
								name: true,
								abbreviation: true
							}
						},
						description: true
					}
				},
				createdAt: true
			},
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
			data: result,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getStockMovementDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.stock_req_productWhereInput = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				inventory: {
					description: {
						contains: search,
						mode: 'insensitive',
					}
				},
			}
		]
	}

	if (category[0] || subcategory[0] || from || to) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						inventory: {
							category_masterId: {
								in: category,
							},
						}

					},
				]
				: []),
			...(subcategory[0]
				? [
					{
						inventory: {
							subcategory_masterId: {
								in: subcategory,
							},
						}
					},
				]
				: []),
			...(from && to
				? [
					{
						createdAt: {
							gte: new Date(from),
							lte: new Date(to)
						}
					}
				]
				: [])
		]
	}

	whereClause.stock_request = {
		status: {
			notIn: [-2, -1, 0, 1, 2, 80, 81, 82]
		}
	}


	try {
		count = await prisma.stock_req_product.count({
			where: whereClause,
		})
		const result = await prisma.stock_req_product.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				stock_handover_no: true,
				serial_no: true,
				quantity: true,
				stock_request: {
					select: {
						id: true,
						createdAt: true,
						emp_id: true,
						emp_name: true,
						stock_handover: {
							select: {
								createdAt: true
							}
						}
					}
				},
				inventory: {
					select: {
						category: {
							select: {
								id: true,
								name: true
							}
						},
						subcategory: {
							select: {
								id: true,
								name: true
							}
						},
						unit: {
							select: {
								id: true,
								name: true,
								abbreviation: true
							}
						},
						description: true
					}
				},
				createdAt: true
			},
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
			data: result,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}
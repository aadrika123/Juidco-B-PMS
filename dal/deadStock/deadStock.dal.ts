import { Request } from 'express'
import getErrorMessage from '../../lib/getErrorMessage'
import { Prisma, PrismaClient } from '@prisma/client'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()


export const getItemDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.inventory_dead_stockWhereInput = {}

	// const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined
	const search: any[] = Array.isArray(req?.query?.search) ? req?.query?.search : [req?.query?.search]

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	// const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

	if (search.length > 0) {
		whereClause.AND = search.map(term => ({
			inventory: {
				description: {
					contains: term,
					mode: 'insensitive',
				},
			}
		}))
	}

	//creating filter options for the query
	if (category[0]) {
		whereClause.inventory = {
			category_masterId: {
				in: category,
			}
		}
	}
	if (subcategory[0]) {
		whereClause.inventory = {
			subcategory_masterId: {
				in: subcategory,
			}
		}
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
				quantity: true,
				inventory: {
					select: {
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
						description: true,
						quantity: true,
						warranty: true,
					}
				}
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

export const retrieveItemDal = async (req: Request) => {
	const { id } = req.body
	try {

		const stock = await prisma.inventory_dead_stock.findFirst({
			where: {
				id: id
			},
			include: {
				inventory: {
					select: {
						subcategory: {
							select: {
								id: true,
								name: true
							}
						}
					}
				}
			}
		})

		await prisma.$transaction(async (tx) => {
			await tx.inventory_dead_stock_image.deleteMany({
				where: {
					inventory_dead_stockId: id
				}
			})
			await tx.inventory_dead_stock.delete({
				where: {
					id: id
				}
			})
			await tx.inventory.update({
				where: {
					id: stock?.inventoryId
				},
				data: {
					quantity: {
						increment: stock?.quantity
					}
				}
			})
			await tx.$queryRawUnsafe(`
				UPDATE product.product_${stock?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
				SET is_available = true, is_dead = false, quantity = quantity + ${stock?.quantity}
				WHERE serial_no = '${stock?.serial_no as string}'
			`)
		})

		return 'Successfully retrieved'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}
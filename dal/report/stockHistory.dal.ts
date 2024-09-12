import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const getStockListDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = String(req?.query?.from)//yyyy-mm-dd
	const to: string | undefined = String(req?.query?.to)//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.inventoryWhereInput = {}

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
				quantity: true,
				warranty: true,
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

export const getStockHistoryDal = async (req: Request) => {

	const { inventory } = req.params

	try {
		const inventoryData: any = await prisma.inventory.findFirst({
			where: {
				id: inventory
			},
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
				quantity: true,
				warranty: true,
			},
		})

		const products: any[] = await prisma.$queryRawUnsafe(`
			SELECT *
			FROM product.product_${inventoryData?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
			WHERE inventory_id = '${inventory}'
			`)

		const procurementNumbers: string[] = []
		products.filter((item) => {
			if (!procurementNumbers.includes(item?.procurement_no)) {
				procurementNumbers.push(item?.procurement_no)
			}
		})

		const procurements: any[] = []

		await Promise.all(
			procurementNumbers.map(async (item) => {
				const procurement = await prisma.procurement.findFirst({
					where: {
						procurement_no: item
					},
					select: {
						procurement_no: true,
						total_rate: true,
						createdAt: true
					}
				})
				procurements.push(procurement)
			})
		)

		const handoverData = await prisma.stock_handover.findMany({
			where: {
				inventoryId: inventoryData?.id
			}
		})

		inventoryData.products = products
		inventoryData.procurements = procurements
		inventoryData.handover = handoverData


		return inventoryData
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}
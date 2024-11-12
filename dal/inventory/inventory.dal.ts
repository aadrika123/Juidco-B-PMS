import { Request, Response } from 'express'
import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient, inventory } from '@prisma/client'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const createItemDal = async (req: Request) => {
	const { category, subcategory, brand, quantity, description, unit } = req.body

	const data: inventory = {
		category: { connect: { id: category } },
		subcategory: { connect: { id: subcategory } },
		unit: { connect: { id: unit } },
		...(brand && { brand_masterId: brand }),
		...(quantity && { quantity: quantity }),
		...(description && { description: description }),
	}

	try {
		const result = await prisma.inventory.create({
			data: data,
		})
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getItemDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: any = {}

	// const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined
	const search: any[] = Array.isArray(req?.query?.search) ? req?.query?.search : [req?.query?.search]

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

	if (search.length > 0) {
		whereClause.AND = search.map(term => ({
			description: {
				contains: term,
				mode: 'insensitive',
			},
		}))
	}

	//creating filter options for the query
	if (category[0]) {
		whereClause.category_masterId = {
			in: category,
		}
	}
	if (subcategory[0]) {
		whereClause.subcategory_masterId = {
			in: subcategory,
		}
	}
	if (brand[0]) {
		whereClause.brand_masterId = {
			in: brand,
		}
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

export const getItemByFilterDal = async (req: Request) => {
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

	if (!category[0] || !subcategory[0]) {
		return { error: true, message: 'Category and sub-category are required' }
	}

	console.log(req?.query?.category,req?.query?.scategory)

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				description: {
					contains: search,
					mode: 'insensitive',
				},
			},
		]
	}

	//creating filter options for the query
	// if (category[0]) {
	// 	whereClause.category_masterId = {
	// 		in: category,
	// 	}
	// }
	// if (subcategory[0]) {
	// 	whereClause.subcategory_masterId = {
	// 		in: subcategory,
	// 	}
	// }
	// if (brand[0]) {
	// 	whereClause.brand_masterId = {
	// 		in: brand,
	// 	}
	// }
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

export const getItemBySubcategoryBrandDal = async (req: Request) => {
	const { subcategory, brand } = req.body
	try {
		const result = await prisma.inventory.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: {
				subcategory_masterId: subcategory,
				brand_masterId: brand,
			},
			select: {
				id: true,
				description: true,
			},
		})
		return { result }
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getQuantityByItemIdDal = async (req: Request) => {
	const { id } = req.params
	try {
		if (!id) {
			throw { error: true, message: "ID is required as 'id'" }
		}
		const invData = await prisma.inventory.findFirst({
			where: {
				id: id,
			},
			select: {
				id: true,
				quantity: true,
			},
		})
		const invBuffer: any = await prisma.inventory_buffer.aggregate({
			where: {
				inventoryId: id,
			},
			_sum: {
				reserved_quantity: true,
			},
		})

		if (!invData || !invBuffer) {
			throw { error: true, message: 'Invalid id' }
		}

		const totalAvailableQuantity = invBuffer?._sum?.reserved_quantity ? Number(invData?.quantity) - invBuffer?._sum?.reserved_quantity : Number(invData?.quantity)
		return { totalAvailableQuantity: totalAvailableQuantity }
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getItemByIdDal = async (req: Request) => {
	const { id } = req.params
	try {
		if (!id) {
			throw { error: true, message: "ID is required as 'id'" }
		}
		const invData = await prisma.inventory.findFirst({
			where: {
				id: id,
				quantity: {
					not: 0
				}
			},
			select: {
				id: true,
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
				unit: {
					select: {
						id: true,
						name: true,
						abbreviation: true
					},
				},
				description: true,
				quantity: true,
				warranty: true,
			},
		})

		const product = await prisma
			.$queryRawUnsafe(
				`
				SELECT *
				FROM product.product_${invData?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
				WHERE inventory_id = '${id as string}' and quantity != 0 and is_available =  true
					`
			)

		return {
			...invData,
			products: product
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}
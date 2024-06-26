import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const createBrandDal = async (req: Request) => {
	const { name, subcategory } = req.body

	const data: any = {
		name: name,
		subcategory_masterId: subcategory,
	}

	try {
		const result = await prisma.brand_master.create({
			data: data,
		})
		return result
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: err?.message }
	}
}

export const getBrandDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: any = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	const status: boolean | undefined = req?.query?.status === undefined ? undefined : req?.query?.status === 'true' ? true : false
	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				name: {
					contains: search,
					mode: 'insensitive',
				},
			},
		]
	}

	//creating filter options for the query
	if (subcategory[0] || status !== undefined) {
		whereClause.AND = [
			...(subcategory[0]
				? [
						{
							subcategory_masterId: {
								in: subcategory,
							},
						},
					]
				: []),
			...(status !== undefined
				? [
						{
							status: status,
						},
					]
				: []),
		]
	}
	try {
		count = await prisma.brand_master.count({
			where: whereClause,
		})
		const result = await prisma.brand_master.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			include: {
				subcategory: true,
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
		console.log(err?.message)
		return { error: true, message: err?.message }
	}
}

export const getBrandBySubcategoryIdDal = async (req: Request) => {
	const { subcategoryId } = req.params
	try {
		const result = await prisma.brand_master.findMany({
			where: {
				subcategory_masterId: subcategoryId,
			},
		})
		return result
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: err?.message }
	}
}

export const createBrandNoReqDal = async (name: string, subcategory: string) => {
	// const { name, subcategory } = req.body

	const data: any = {
		name: name,
		subcategory_masterId: subcategory,
	}

	try {
		const result = await prisma.brand_master.create({
			data: data,
		})
		return result
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: err?.message }
	}
}

export const getBrandBySubcategoryIdActiveOnlyDal = async (req: Request) => {
	const { subcategory } = req.params
	try {
		const result = await prisma.brand_master.findMany({
			where: {
				subcategory_masterId: subcategory,
				status: true,
			},
			orderBy: {
				updatedAt: 'desc',
			},
		})
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const getBrandActiveOnlyDal = async (req: Request) => {
	try {
		const result = await prisma.brand_master.findMany({
			where: {
				status: true,
			},
			orderBy: {
				updatedAt: 'desc',
			},
		})
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const editBrandDal = async (req: Request) => {
	const { id, name, subcategory } = req.body
	try {
		if (!id) {
			throw { error: true, message: "ID i required as 'id'" }
		}
		const result = await prisma.brand_master.update({
			where: {
				id: id,
			},
			data: {
				name: name,
				subcategory_masterId: subcategory,
			},
		})
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const switchStatusDal = async (req: Request) => {
	const { id } = req.body
	try {
		const result = await prisma.$executeRaw`update brand_master set status = not status where id=${id}`
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

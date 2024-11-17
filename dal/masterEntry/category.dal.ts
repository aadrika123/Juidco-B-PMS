import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const createCategoryDal = async (req: Request) => {
	const { name, auth } = req.body
	const ulb_id = auth?.ulb_id

	const data: any = {
		name: name,
		ulb_id: ulb_id
	}

	try {
		if (!ulb_id) {
			throw { error: true, message: 'ULB id is not valid' }
		}
		const result = await prisma.category_master.create({
			data: data,
		})
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const getCategoryDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: any = {}
	const ulb_id = req?.body?.auth?.ulb_id

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined
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
	if (status !== undefined) {
		whereClause.AND = [
			...(status !== undefined
				? [
					{
						status: status,
					},
				]
				: []),
		]
	}

	whereClause.AND = [
		...(Array.isArray(whereClause?.AND) ? [whereClause?.AND] : []),
		{
			ulb_id: ulb_id,
		},
	]

	try {
		count = await prisma.category_master.count({
			where: whereClause,
		})
		const result = await prisma.category_master.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
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
		return { error: true, message: err?.message }
	}
}

export const getCategoryByIdDal = async (req: Request) => {
	const { id } = req.params
	try {
		const result = await prisma.category_master.findFirst({
			where: {
				id: id,
			},
		})
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const getCategoryByName = async (name: string) => {
	try {
		const result = await prisma.category_master.findFirst({
			where: {
				name: {
					equals: name,
					mode: 'insensitive',
				},
			},
		})
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const getCategoryActiveOnlyDal = async (req: Request) => {
	const ulb_id = req?.body?.auth?.ulb_id
	try {
		const result = await prisma.category_master.findMany({
			where: {
				status: true,
				ulb_id: ulb_id
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

export const editCategoryDal = async (req: Request) => {
	const { id, name } = req.body
	try {
		if (!id) {
			throw { error: true, message: "ID i required as 'id'" }
		}
		const result = await prisma.category_master.update({
			where: {
				id: id,
			},
			data: {
				name: name,
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
		const result = await prisma.$executeRaw`update category_master set status = not status where id=${id}`
		if (result === 0) {
			throw { error: true, message: 'Error while switching status' }
		}
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

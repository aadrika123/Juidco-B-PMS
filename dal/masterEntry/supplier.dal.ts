import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const createSupplierDal = async (req: Request) => {
	const { name, gst_no } = req.body
	const ulb_id = req?.body?.auth?.ulb_id

	const data: any = {
		name: name,
		gst_no: gst_no,
		ulb_id: ulb_id
	}

	try {
		const result = await prisma.supplier_master.create({
			data: data,
		})
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const getSupplierDal = async (req: Request) => {
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
				gst_no: {
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
		count = await prisma.supplier_master.count({
			where: whereClause,
		})
		const result = await prisma.supplier_master.findMany({
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

export const getSupplierByIdDal = async (req: Request) => {
	const { id } = req.params
	try {
		const result = await prisma.supplier_master.findFirst({
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

export const getSupplierActiveOnlyDal = async (req: Request) => {
	const ulb_id = req?.body?.auth?.ulb_id
	try {
		const result = await prisma.supplier_master.findMany({
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

export const editSupplierDal = async (req: Request) => {
	const { id, name, gst_no } = req.body
	try {
		if (!id) {
			throw { error: true, message: "ID is required as 'id'" }
		}
		const result = await prisma.supplier_master.update({
			where: {
				id: id,
			},
			data: {
				name: name,
				gst_no: gst_no,
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
		const result = await prisma.$executeRaw`update supplier_master set status = not status where id=${id}`
		if (result === 0) {
			throw { error: true, message: 'Error while switching status' }
		}
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const getSupplierByProcurementNoDal = async (req: Request) => {
	const { procurement_no } = req.params


	try {

		const data = await prisma.supplier_master.findMany({
			where: {
				procurement_no: procurement_no
			}
		})

		return data
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: err?.message }
	}
}
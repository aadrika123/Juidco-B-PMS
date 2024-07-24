import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const handoverAcknowledgeDal = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string } = req.body
	const user = req.body.auth
	try {
		const stockReq = await prisma.stock_request.findFirst({
			where: {
				stock_handover_no: stock_handover_no,
			},
			select: {
				status: true,
				emp_id: true,
			},
		})
		if (!stockReq) {
			throw { error: true, message: 'Invalid stock handover number' }
		}
		if (stockReq?.status !== 4) {
			throw { error: true, message: 'Invalid status of stock request' }
		}
		if (stockReq?.emp_id !== user?.emp_id) {
			throw { error: true, message: 'Unauthorized employee' }
		}

		await prisma.$transaction(async tx => {
			await tx.stock_request.update({
				where: {
					stock_handover_no: stock_handover_no,
				},
				data: {
					is_alloted: true,
					allotment_date: new Date(),
					status: 41,
				},
			})
		})

		return 'Acknowledged'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getHandoverDataDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: any = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined
	const allotted: boolean | undefined = req?.query?.allotted === undefined ? undefined : req?.query?.allotted === 'true' ? true : false
	const user = req.body.auth
	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				stock_handover_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
		]
	}

	//creating filter options for the query
	if (allotted !== undefined) {
		whereClause.AND = [
			...(allotted !== undefined
				? [
						{
							is_alloted: allotted,
						},
					]
				: []),
		]
	}
	try {
		if (!user?.emp_id) {
			throw { error: true, message: 'Unauthorized employee' }
		}
		count = await prisma.stock_request.count({
			where: {
				...whereClause,
				emp_id: user?.emp_id,
			},
		})
		const result = await prisma.stock_request.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: {
				...whereClause,
				emp_id: user?.emp_id,
			},
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				stock_handover_no: true,
				emp_id: true,
				emp_name: true,
				inventory: {
					select: {
						id: true,
						category: {
							select: { name: true },
						},
						subcategory: {
							select: { name: true },
						},
						brand: {
							select: { name: true },
						},
						unit: {
							select: { name: true },
						},
						description: true,
						quantity: true,
						warranty: true,
					},
				},
				is_alloted: true,
				status: true,
				allotted_quantity: true,
				allotment_date: true,
				release_date: true,
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
		return { error: true, message: err?.message }
	}
}

import { Request } from 'express'
import { Prisma, PrismaClient, tendering_type_enum } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const getWarrantyReportDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	const tenderingType: string | undefined = req?.query?.ttype ? String(req?.query?.ttype) : undefined
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.service_requestWhereInput = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	const status: any = req?.query?.status === 'rejected' ? [12, 22] : req?.query?.status === 'claimed' ? [23] : req?.query?.status === 'pending' ? [0, 10, 11, 20, 21] : undefined

	try {

		//creating search options for the query
		if (search) {
			whereClause.OR = [
				{
					service_no: {
						contains: search,
						mode: 'insensitive',
					}
				}

			]
		}

		if (category[0] || subcategory[0] || from || to || status[0]) {
			whereClause.AND = [
				...(category[0]
					? [
						{
							inventory: {
								category_masterId: {
									in: category,
								},
							}
						}
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
				...(status[0]
					? [

						{
							status: {
								in: status
							}
						},
					]
					: []),
			]
		}


		count = await prisma.service_request.count({
			where: whereClause,
		})
		const result = await prisma.service_request.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				stock_handover_no: true,
				service_no: true,
				status: true,
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
						}
					}
				},
				service_req_product: {
					select: {
						serial_no: true,
						quantity: true
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
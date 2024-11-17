import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const getPlacedOrderReportDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.procurementWhereInput = {}
	const ulb_id = req?.body?.auth?.ulb_id

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	try {

		//creating search options for the query
		if (search) {
			whereClause.OR = [
				{
					procurement_no: {
						contains: search,
						mode: 'insensitive',
					}
				}
			]
		}

		// if (category[0] || subcategory[0] || from || to) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						category_masterId: {
							in: category,
						},
					}
				]
				: []),
			...(subcategory[0]
				? [

					{
						procurement_stocks: {
							some: {
								subCategory_masterId: {
									in: subcategory,
								},
							}
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
			{
				boq: {
					bid_details: {
						creationStatus: {
							notIn: [4, 5]
						}
					}
				}
			},
			{
				ulb_id: ulb_id
			}
		]
		// }


		count = await prisma.procurement.count({
			where: whereClause,
		})
		const result = await prisma.procurement.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				procurement_no: true,
				status: true,
				category: {
					select: {
						id: true,
						name: true
					}
				},
				total_rate: true,
				procurement_stocks: {
					select: {
						id: true,
						subCategory: {
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
						rate: true,
						quantity: true,
						description: true,
						total_rate: true
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
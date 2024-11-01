import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const getRateContractReportDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.rate_contractWhereInput = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	try {

		//creating search options for the query
		if (search) {
			whereClause.OR = [
				{
					description: {
						contains: search,
						mode: 'insensitive',
					}
				}

			]
		}

		if (category[0] || subcategory[0] || from || to) {
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


		count = await prisma.rate_contract.count({
			where: whereClause,
		})
		const result = await prisma.rate_contract.findMany({
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
						name: true
					}
				},
				description: true,
				start_date: true,
				end_date: true,
				createdAt: true,
				rate_contract_supplier: {
					include: {
						supplier_master: true
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
import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import getErrorMessage from '../../../../lib/getErrorMessage'
import { pagination } from '../../../../type/common.type'

const prisma = new PrismaClient()

export const getFinanceBoqReportDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = String(req?.query?.from)//yyyy-mm-dd
	const to: string | undefined = String(req?.query?.to)//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.finance_boq_inboxWhereInput = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				reference_no: {
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
						boq: {
							procurement: {
								category_masterId: {
									in: category,
								},
							}
						}

					}
				]
				: []),
			...(subcategory[0]
				? [

					{
						boq: {
							procurement: {
								procurement_stocks: {
									some: {
										subCategory_masterId: {
											in: subcategory,
										},
									}
								}
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
				: [])
		]
	}

	whereClause.boq = {
		status: {
			in: [40]
		}
	}

	try {
		count = await prisma.finance_boq_inbox.count({
			where: whereClause,
		})
		const result = await prisma.finance_boq_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				reference_no: true,
				boq: {
					select: {
						procurement_no: true,
						estimated_cost: true,
						hsn_code: true,
						procurements: {
							select: {
								quantity: true,
								rate: true,
								amount: true
							}
						},
						procurement: {
							select: {
								procurement_stocks: {
									select: {
										category: {
											select: {
												id: true,
												name: true
											}
										},
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
										description: true,
										quantity: true,
										rate: true,
										total_rate: true
									}
								}
							}
						}
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
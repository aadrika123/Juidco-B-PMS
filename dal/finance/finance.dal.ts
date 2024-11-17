import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'
import axios from 'axios'
import { extractRoleName } from '../../lib/roleNameExtractor'

const prisma = new PrismaClient()

export const getBoqByRefNoDal = async (req: Request) => {
	const { reference_no } = req.params
	try {
		const result: any = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				reference_no: true,
				gst: true,
				estimated_cost: true,
				hsn_code: true,
				remark: true,
				status: true,
				isEdited: true,
				procurement_stocks: {
					select: {
						procurement_no: true,
						quantity: true,
						rate: true,
						remark: true,
						hsn_code: true,
						gst: true,
						category: {
							select: {
								name: true,
							},
						},
						subCategory: {
							select: {
								name: true,
							},
						},
						unit: {
							select: {
								name: true,
							},
						},
						description: true,
					},
				},
				boq_doc: {
					select: {
						docPath: true,
					},
				},
			},
		})

		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getBoqInboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.finance_boq_inboxWhereInput = {}
	const ulb_id = req?.body?.auth?.ulb_id

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				reference_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				boq: {
					procurements: {
						some: {
							procurement: {
								procurement_stocks: {
									some: {
										description: {
											contains: search,
											mode: 'insensitive',
										},
									}
								}
							},
						},
					},
				},
			},
		]
	}

	//creating filter options for the query
	if (category[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						category_masterId: {
							in: category,
						},
					},
				},
			},
		}
	}
	if (subcategory[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						procurement_stocks: {
							some: {
								subCategory_masterId: {
									in: subcategory,
								},
							}
						}
					},
				},
			},
		}
	}
	if (status[0]) {
		whereClause.boq = {
			status: {
				in: status.map(Number),
			},
		}
	}
	if (brand[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						procurement_stocks: {
							some: {
								brand_masterId: {
									in: brand,
								},
							}
						}
					},
				},
			},
		}
	}

	whereClause.boq = {
		ulb_id: ulb_id
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
						reference_no: true,
						gst: true,
						estimated_cost: true,
						hsn_code: true,
						remark: true,
						status: true,
						isEdited: true,
						procurement_stocks: {
							select: {
								procurement_no: true,
								quantity: true,
								rate: true,
								remark: true,
								category: {
									select: {
										name: true,
									},
								},
								subCategory: {
									select: {
										name: true,
									},
								},
								unit: {
									select: {
										name: true,
									},
								},
							},
						},
						boq_doc: {
							select: {
								docPath: true,
							},
						},
					},
				},
			},
		})

		let dataToSend: any[] = []
		result.forEach((item: any) => {
			//flatten the boq object
			const { boq, ...rest } = item
			dataToSend.push({ ...rest, ...boq })
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
			data: dataToSend,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getBoqOutboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.finance_boq_outboxWhereInput = {}
	const ulb_id = req?.body?.auth?.ulb_id

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				reference_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				boq: {
					procurements: {
						some: {
							procurement: {
								procurement_stocks: {
									some: {
										description: {
											contains: search,
											mode: 'insensitive',
										},
									}
								}
							},
						},
					},
				},
			},
		]
	}

	//creating filter options for the query
	if (category[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						category_masterId: {
							in: category,
						},
					},
				},
			},
		}
	}
	if (subcategory[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						procurement_stocks: {
							some: {
								subCategory_masterId: {
									in: subcategory,
								},
							}
						}
					},
				},
			},
		}
	}
	if (status[0]) {
		whereClause.boq = {
			status: {
				in: status.map(Number),
			},
		}
	}
	if (brand[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						procurement_stocks: {
							some: {
								brand_masterId: {
									in: brand,
								},
							}
						}
					},
				},
			},
		}
	}

	whereClause.boq = {
		ulb_id: ulb_id
	}

	try {
		count = await prisma.finance_boq_outbox.count({
			where: whereClause,
		})
		const result = await prisma.finance_boq_outbox.findMany({
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
						reference_no: true,
						gst: true,
						estimated_cost: true,
						hsn_code: true,
						remark: true,
						status: true,
						isEdited: true,
						procurement_stocks: {
							select: {
								procurement_no: true,
								quantity: true,
								rate: true,
								remark: true,
								category: {
									select: {
										name: true,
									},
								},
								subCategory: {
									select: {
										name: true,
									},
								},
								unit: {
									select: {
										name: true,
									},
								},
							},
						},
						boq_doc: {
							select: {
								docPath: true,
							},
						},
					},
				},
			},
		})

		let dataToSend: any[] = []
		result.forEach((item: any) => {
			//flatten the boq object
			const { boq, ...rest } = item
			dataToSend.push({ ...rest, ...boq })
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
			data: dataToSend,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const approveBoqDal = async (req: Request) => {
	const { reference_no }: { reference_no: string } = req.body
	const ulb_id = req?.body?.auth?.ulb_id
	try {
		const boqData = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
			},
		})

		if (boqData?.status !== 40 && boqData?.status !== 41) {
			throw { error: true, message: 'Invalid status of BOQ to be approved' }
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.finance_boq_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.finance_boq_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_outbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.boq.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: 42
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_IA),
					title: 'BOQ approved by finance',
					destination: 21,
					from: 'Finance',
					description: `There is a BOQ approved by finance. Reference Number : ${reference_no}`,
					ulb_id
				},
			})
		})

		return 'Approved by finance'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const returnBoqDal = async (req: Request) => {
	const { reference_no, remark }: { reference_no: string; remark: string } = req.body
	const ulb_id = req?.body?.auth?.ulb_id
	try {
		const boqData = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
			},
		})

		if (boqData?.status !== 40 && boqData?.status !== 41) {
			throw { error: true, message: 'Invalid status of BOQ to be returned' }
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.finance_boq_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.finance_boq_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_outbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.boq.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: 41,
					remark: remark,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_IA),
					title: 'BOQ returned from finance',
					destination: 21,
					from: 'Finance',
					description: `There is a BOQ return from finance. Reference Number : ${reference_no}`,
					ulb_id
				},
			})
		})

		return 'Returned to DA'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

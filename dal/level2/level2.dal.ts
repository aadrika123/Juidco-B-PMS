import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
// import { imageUploader } from '../../lib/imageUploader'
import { pagination } from '../../type/common.type'
import { extractRoleName } from '../../lib/roleNameExtractor'
// import { boqData } from '../../type/accountant.type'
// import generateprocurementNumber from '../../lib/procurementNumberGenerator'
// import axios from 'axios'

const prisma = new PrismaClient()

export const getInboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.level2_inboxWhereInput = {}
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
				procurement_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				procurement: {
					procurement_stocks: {
						some: {
							description: {
								contains: search,
								mode: 'insensitive',
							},
						}
					},
				}
			},
		]
	}

	if (category[0] || subcategory[0] || brand[0]) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						procurement: {
							category_masterId: {
								in: category,
							},
						}
					},
				]
				: []),
			...(subcategory[0]
				? [
					{
						procurement: {
							procurement_stocks: {
								some: {
									subCategory_masterId: {
										in: subcategory,
									},
								},
							}
						}
					},
				]
				: []),
			...(brand[0]
				? [
					{
						procurement: {
							procurement_stocks: {
								some: {
									brand_masterId: {
										in: brand,
									},
								},
							}
						}
					},
				]
				: []),
			...(status[0]
				? [
					{
						procurement: {
							status: {
								in: status.map(Number),
							},
						}
					},
				]
				: []),
			{
				procurement: {
					ulb_id: ulb_id
				}
			}
		]
	} else {
		whereClause.AND = [
			{
				procurement: {
					ulb_id: ulb_id
				}
			}
		]
	}

	try {
		count = await prisma.level2_inbox.count({
			where: whereClause,
		})
		const result = await prisma.level2_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				procurement_no: true,
				procurement: {
					select: {
						procurement_no: true,
						category: {
							select: {
								name: true,
							},
						},
						total_rate: true,
						isEdited: true,
						remark: true,
						status: true,
						procurement_stocks: true,
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.procurement }
			delete item.procurement
			resultToSend.push({ ...item, ...temp })
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
			data: resultToSend,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getOutboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.level2_outboxWhereInput = {}
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
				procurement_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				procurement: {
					procurement_stocks: {
						some: {
							description: {
								contains: search,
								mode: 'insensitive',
							},
						}
					},
				}
			},
		]
	}

	if (category[0] || subcategory[0] || brand[0]) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						procurement: {
							category_masterId: {
								in: category,
							},
						}
					},
				]
				: []),
			...(subcategory[0]
				? [
					{
						procurement: {
							procurement_stocks: {
								some: {
									subCategory_masterId: {
										in: subcategory,
									},
								},
							}
						}
					},
				]
				: []),
			...(brand[0]
				? [
					{
						procurement: {
							procurement_stocks: {
								some: {
									brand_masterId: {
										in: brand,
									},
								},
							}
						}
					},
				]
				: []),
			...(status[0]
				? [
					{
						procurement: {
							status: {
								in: status.map(Number),
							},
						}
					},
				]
				: []),
			{
				procurement: {
					ulb_id: ulb_id
				}
			}
		]
	} else {
		whereClause.AND = [
			{
				procurement: {
					ulb_id: ulb_id
				}
			}
		]
	}

	try {
		count = await prisma.level2_outbox.count({
			where: whereClause,
		})
		const result = await prisma.level2_outbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				procurement_no: true,
				procurement: {
					select: {
						procurement_no: true,
						category: {
							select: {
								name: true,
							},
						},
						total_rate: true,
						isEdited: true,
						remark: true,
						status: true,
						procurement_stocks: true,
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.procurement }
			delete item.procurement
			resultToSend.push({ ...item, ...temp })
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
			data: resultToSend,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const returnToLevel1Dal = async (req: Request) => {
	const { procurement_no, remark }: { procurement_no: string; remark: string } = req.body
	const ulb_id = req?.body?.auth?.ulb_id
	try {
		if (!procurement_no) {
			throw {
				error: true,
				message: `Procurement no is required as 'procurement_no'`,
			}
		}

		const boqData = await prisma.procurement.findFirst({
			where: {
				procurement_no: procurement_no,
			},
			select: {
				status: true,
			},
		})

		if (boqData?.status !== 20 && boqData?.status !== 23) {
			throw {
				error: true,
				message: 'Invalid status of BOQ to return',
			}
		}

		if (!remark) {
			throw { error: true, message: 'Remark is mandatory' }
		}


		//start transaction
		await prisma.$transaction(async tx => {
			await tx.level2_inbox.delete({
				where: {
					procurement_no: procurement_no,
				},
			})

			await tx.level1_inbox.create({
				data: {
					procurement_no: procurement_no,
				},
			})

			await tx.level2_outbox.create({
				data: {
					procurement_no: procurement_no,
				},
			})

			await tx.level1_outbox.delete({
				where: {
					procurement_no: procurement_no,
				},
			})

			await tx.procurement.update({
				where: {
					procurement_no: procurement_no,
				},
				data: {
					status: 21,
					remark: remark,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_LEVEL1),
					title: 'Procurement returned',
					destination: 50,
					from: await extractRoleName(Number(process.env.ROLE_LEVEL2)),
					description: `There Procurement returned from level 2. procurement Number : ${procurement_no}`,
					ulb_id
				},
			})
		})

		return 'Returned to level 1'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const approvalByLevel2Dal = async (req: Request) => {
	const { procurement_no }: { procurement_no: string } = req.body
	const ulb_id = req?.body?.auth?.ulb_id
	try {
		if (!procurement_no) {
			throw {
				error: true,
				message: `procurement no is required as 'procurement_no'`,
			}
		}

		const boqData = await prisma.procurement.findFirst({
			where: {
				procurement_no: procurement_no,
			},
			select: {
				status: true,
			},
		})

		if (boqData?.status !== 20 && boqData?.status !== 23) {
			throw { error: true, message: 'Invalid status of procurement to be approved' }
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.level2_inbox.delete({
				where: {
					procurement_no: procurement_no,
				},
			})

			await tx.level2_outbox.create({
				data: {
					procurement_no: procurement_no,
				},
			})

			await tx.ia_pre_procurement_inbox.create({
				data: {
					procurement_no: procurement_no,
				},
			})

			await tx.ia_pre_procurement_outbox.delete({
				where: {
					procurement_no: procurement_no,
				},
			})

			await tx.procurement.update({
				where: {
					procurement_no: procurement_no,
				},
				data: {
					status: 24,
					remark: '' as string,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_IA),
					title: 'Procurement approved by level 2',
					destination: 82,
					from: await extractRoleName(Number(process.env.ROLE_LEVEL1)),
					description: `There is a procurement approved by level 2. procurement Number : ${procurement_no}`,
					ulb_id
				},
			})
		})

		return 'Approved by level 2'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const rejectionByLevel2Dal = async (req: Request) => {
	const { procurement_no, remark }: { procurement_no: string, remark: string } = req.body
	const ulb_id = req?.body?.auth?.ulb_id
	try {
		if (!procurement_no) {
			throw {
				error: true,
				message: `procurement no is required as 'procurement_no'`,
			}
		}

		const procurement = await prisma.procurement.findFirst({
			where: {
				procurement_no: procurement_no,
			},
			select: {
				status: true,
			},
		})

		if (procurement?.status !== 20 && procurement?.status !== 23) {
			throw { error: true, message: 'Invalid status of BOQ to be rejected' }
		}

		if (!remark) {
			throw { error: true, message: 'Remark is mandatory' }
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.level2_inbox.delete({
				where: {
					procurement_no: procurement_no,
				},
			})

			await tx.level2_outbox.create({
				data: {
					procurement_no: procurement_no,
				},
			})

			await tx.ia_pre_procurement_inbox.create({
				data: {
					procurement_no: procurement_no,
				},
			})

			await tx.ia_pre_procurement_outbox.delete({
				where: {
					procurement_no: procurement_no,
				},
			})

			await tx.procurement.update({
				where: {
					procurement_no: procurement_no,
				},
				data: {
					status: 22,
					remark: remark,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_IA),
					title: 'Procurement rejected by level 2',
					destination: 82,
					from: await extractRoleName(Number(process.env.ROLE_LEVEL1)),
					description: `There is a procurement rejected by level 2. procurement Number : ${procurement_no}`,
					ulb_id
				},
			})
		})

		return 'Rejected by level 2'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

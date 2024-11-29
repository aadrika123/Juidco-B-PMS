/*
Author - Anil Tigga
Status - Closed
*/

import { Request } from 'express'
import { PrismaClient, service_request, service_enum, Prisma } from '@prisma/client'
import { serviceTranslator } from '../distributor/distServiceReq.dal'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'
import { extractRoleName } from '../../lib/roleNameExtractor'

const prisma = new PrismaClient()

export const getServiceReqInboxDal = async (req: Request) => {
	console.log("called for service reqqq")
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.da_service_req_inboxWhereInput = {}
	const ulb_id = req?.body?.auth?.ulb_id

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]
	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
	const service: any[] = Array.isArray(req?.query?.service) ? req?.query?.service : [req?.query?.service]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				service_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				service_req: {
					stock_handover_no: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	if (category[0] || subcategory[0] || brand[0] || status[0] || service[0]) {
		whereClause.AND = [
			...(service[0]
				? [
					{
						service_req: {
							service: {
								in: service,
							},
						},
					},
				]
				: []),
			...(category[0]
				? [
					{
						service_req: {
							inventory: {
								category_masterId: {
									in: category,
								},
							},
						},
					},
				]
				: []),
			...(subcategory[0]
				? [
					{
						service_req: {
							inventory: {
								subcategory_masterId: {
									in: subcategory,
								},
							},
						},
					},
				]
				: []),
			...(brand[0]
				? [
					{
						service_req: {
							inventory: {
								brand_masterId: {
									in: brand,
								},
							},
						},
					},
				]
				: []),
			...(status[0]
				? [
					{
						service_req: {
							status: {
								in: status.map(Number),
							},
						},
					},
				]
				: []),
			{
				service_req: {
					ulb_id: ulb_id
				}
			}
		]
	} else {
		whereClause.AND = [
			{
				service_req: {
					ulb_id: ulb_id
				}
			}
		]
	}

	try {
		count = await prisma.da_service_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.da_service_req_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				service_no: true,
				service_req: {
					select: {
						stock_handover_no: true,
						service: true,
						remark: true,
						inventory: {
							select: {
								category: {
									select: {
										name: true,
									},
								},
								subcategory: {
									select: {
										name: true,
									},
								},
								brand: {
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
						status: true,
					},
				},
			},
		})

		let resultToSend: any[] = []
		// console.log("da.service.request",result)

		result.map(async (item: any) => {
			const temp = { ...item?.service_req }
			delete item.service_req
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

export const getServiceReqOutboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.da_service_req_outboxWhereInput = {}
	const ulb_id = req?.body?.auth?.ulb_id

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]
	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
	const service: any[] = Array.isArray(req?.query?.service) ? req?.query?.service : [req?.query?.service]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				service_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				service_req: {
					stock_handover_no: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	if (category[0] || subcategory[0] || brand[0] || status[0] || service[0]) {
		whereClause.AND = [
			...(service[0]
				? [
					{
						service_req: {
							service: {
								in: service,
							},
						},
					},
				]
				: []),
			...(category[0]
				? [
					{
						service_req: {
							inventory: {
								category_masterId: {
									in: category,
								},
							},
						},
					},
				]
				: []),
			...(subcategory[0]
				? [
					{
						service_req: {
							inventory: {
								subcategory_masterId: {
									in: subcategory,
								},
							},
						},
					},
				]
				: []),
			...(brand[0]
				? [
					{
						service_req: {
							inventory: {
								brand_masterId: {
									in: brand,
								},
							},
						},
					},
				]
				: []),
			...(status[0]
				? [
					{
						service_req: {
							status: {
								in: status.map(Number),
							},
						},
					},
				]
				: []),
			{
				service_req: {
					ulb_id: ulb_id
				}
			}
		]
	} else {
		whereClause.AND = [
			{
				service_req: {
					ulb_id: ulb_id
				}
			}
		]
	}

	try {
		count = await prisma.da_service_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.da_service_req_outbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				service_no: true,
				service_req: {
					select: {
						stock_handover_no: true,
						service: true,
						remark: true,
						inventory: {
							select: {
								category: {
									select: {
										name: true,
									},
								},
								subcategory: {
									select: {
										name: true,
									},
								},
								brand: {
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
						status: true,
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.service_req }
			delete item.service_req
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

export const approveServiceRequestDal = async (req: Request) => {
	const { service_no }: { service_no: string } = req.body
	const ulb_id = req?.body?.auth?.ulb_id

	try {
		const serviceReq = await prisma.service_request.findFirst({
			where: {
				service_no: service_no,
			},
			select: {
				status: true,
				service: true,
			},
		})

		if (serviceReq?.status !== 10) {
			throw { error: true, message: 'Invalid status of service request to be approved' }
		}

		const iaOutbox = await prisma.ia_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.da_service_req_inbox.delete({
				where: {
					service_no: service_no,
				},
			})

			await tx.da_service_req_outbox.create({
				data: {
					service_no: service_no,
				},
			})

			await tx.ia_service_req_inbox.create({
				data: {
					service_no: service_no,
				},
			})

			if (iaOutbox > 0) {
				await tx.ia_service_req_outbox.delete({
					where: {
						service_no: service_no,
					},
				})
			}

			await tx.service_request.update({
				where: {
					service_no: service_no,
				},
				data: {
					status: 20,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_IA),
					title: 'New Service request',
					destination: 81,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `There is a ${serviceTranslator(serviceReq?.service)}. Service Number : ${service_no}`,
					ulb_id
				},
			})
			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DIST),
					title: 'Service request forwarded',
					destination: 41,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `${serviceTranslator(serviceReq?.service)} forwarded to Inventory Admin. Service Number : ${service_no}`,
					ulb_id
				},
			})
		})

		return 'Approved by DA'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const rejectServiceRequestDal = async (req: Request) => {
	const { service_no }: { service_no: string } = req.body
	const ulb_id = req?.body?.auth?.ulb_id

	try {
		const serviceReq = await prisma.service_request.findFirst({
			where: {
				service_no: service_no,
			},
			select: {
				status: true,
				service: true,
			},
		})

		if (serviceReq?.status !== 10) {
			throw { error: true, message: 'Invalid status of service request to be rejected' }
		}

		const distOutbox = await prisma.dist_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.da_service_req_inbox.delete({
				where: {
					service_no: service_no,
				},
			})

			await tx.da_service_req_outbox.create({
				data: {
					service_no: service_no,
				},
			})

			await tx.dist_service_req_inbox.create({
				data: {
					service_no: service_no,
				},
			})

			if (distOutbox > 0) {
				await tx.dist_service_req_outbox.delete({
					where: {
						service_no: service_no,
					},
				})
			}

			await tx.service_request.update({
				where: {
					service_no: service_no,
				},
				data: {
					status: 12,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DIST),
					title: 'Service request rejected',
					destination: 41,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `${serviceTranslator(serviceReq?.service)} rejected. Service Number : ${service_no}`,
					ulb_id
				},
			})
		})

		return 'Rejected by DA'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const returnServiceRequestDal = async (req: Request) => {
	const { service_no, remark }: { service_no: string; remark: string } = req.body
	const ulb_id = req?.body?.auth?.ulb_id

	try {
		const serviceReq = await prisma.service_request.findFirst({
			where: {
				service_no: service_no,
			},
			select: {
				status: true,
				service: true,
			},
		})

		if (serviceReq?.status !== 10) {
			throw { error: true, message: 'Invalid status of service request to be returned' }
		}

		const distOutbox = await prisma.dist_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.da_service_req_inbox.delete({
				where: {
					service_no: service_no,
				},
			})

			await tx.da_service_req_outbox.create({
				data: {
					service_no: service_no,
				},
			})

			await tx.dist_service_req_inbox.create({
				data: {
					service_no: service_no,
				},
			})

			if (distOutbox > 0) {
				await tx.dist_service_req_outbox.delete({
					where: {
						service_no: service_no,
					},
				})
			}

			await tx.service_request.update({
				where: {
					service_no: service_no,
				},
				data: {
					status: 11,
					remark: remark,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DIST),
					title: 'Service request returned',
					destination: 41,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `${serviceTranslator(serviceReq?.service)} returned from DA. Service Number : ${service_no}`,
					ulb_id
				},
			})
		})

		return 'Returned from DA'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

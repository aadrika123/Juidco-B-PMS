import { Request } from 'express'
import { emp_service_request, PrismaClient, service_enum, service_request } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'
import generateEmpServiceNumber from '../../lib/empServiceNumberGenerator'

const prisma = new PrismaClient()



type reqType = {
	products: productType[]
	service: service_enum
	stock_handover_no: string
	inventoryId: string
	auth: any
}

type productType = {
	serial_no: string
}

export const serviceTranslator = (service: service_enum): string => {
	let result: string
	switch (service) {
		case 'return':
			result = 'Return Request'
			break
		case 'warranty':
			result = 'Warranty Claim Request'
			break
		case 'dead':
			result = 'Dead Stock Request'
			break
	}
	return result
}

// export const createServiceRequestDal = async (req: Request) => {
// 	const { products, service, stock_handover_no, inventoryId, auth }: reqType = req.body

// 	const ulb_id = auth?.ulb_id

// 	try {
// 		const service_no = generateEmpServiceNumber(ulb_id)

// 		const data: Omit<emp_service_request, 'createdAt' | 'updatedAt' | 'remark' | 'id'> = {
// 			service_no: service_no,
// 			stock_handover_no: stock_handover_no,
// 			service: service,
// 			inventoryId: inventoryId,
// 			status: service === 'return' ? 20 : 10,
// 		}

// 		let serviceReq: any

// 		//start transaction
// 		await prisma.$transaction(async tx => {
// 			serviceReq = await tx.service_request.create({
// 				data: data,
// 			})

// 			await Promise.all(
// 				products.map(async product => {
// 					await tx.service_req_product.create({
// 						data: {
// 							service_no: service_no,
// 							serial_no: product?.serial_no,
// 							inventoryId: inventoryId,
// 						},
// 					})
// 				})
// 			)

// 			await tx.dist_service_req_outbox.create({
// 				data: {
// 					service_no: service_no,
// 				},
// 			})

// 			await tx.da_service_req_inbox.create({
// 				data: {
// 					service_no: service_no,
// 				},
// 			})
// 			if (service === 'return') {
// 				await tx.ia_service_req_inbox.create({
// 					data: {
// 						service_no: service_no,
// 					},
// 				})
// 				await tx.notification.create({
// 					data: {
// 						role_id: Number(process.env.ROLE_IA),
// 						title: 'New Service request',
// 						destination: 81,
// 						description: `There is a ${serviceTranslator(service)}. Service Number : ${service_no}`,
// 					},
// 				})
// 			}
// 			await tx.notification.create({
// 				data: {
// 					role_id: Number(process.env.ROLE_DA),
// 					title: 'New Service request',
// 					destination: 26,
// 					description: `There is a ${serviceTranslator(service)}. Service Number : ${service_no}`,
// 				},
// 			})
// 		})

// 		return serviceReq
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: err?.message }
// 	}
// }



export const getServiceReqInboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: any = {}

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
		]
	}

	try {
		count = await prisma.dist_service_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.dist_service_req_inbox.findMany({
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

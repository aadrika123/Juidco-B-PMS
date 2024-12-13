/*
Author - Anil Tigga
Status - Closed
*/

import { Request } from 'express'
import { PrismaClient, service_request, service_enum, Prisma } from '@prisma/client'
import generateServiceNumber from '../../lib/serviceNumberGenerator'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

type reqType = {
	products: string[]
	service: service_enum
	stock_handover_no: string
	inventoryId: string
	auth: any
}

// type productType = {
// 	serial_no: string
// }

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

export const createServiceRequestDal = async (req: Request) => {
	const { products, service, stock_handover_no, inventoryId, auth }: reqType = req.body;
	const ulb_id = auth?.ulb_id;
	try {
		const service_no = generateServiceNumber(ulb_id);
		console.log("service_no",service_no)

		const data: Omit<service_request, 'createdAt' | 'updatedAt' | 'remark' | 'id'> = {
			service_no: service_no,
			stock_handover_no: stock_handover_no,
			service: service,
			inventoryId: inventoryId,
			status: service === 'return' ? 20 : service === 'dead' ? 61 : 10,
			ulb_id: ulb_id
		};

		let serviceReq: any;

		await prisma.$transaction(async (tx) => {
			serviceReq = await tx.service_request.create({
				data: data,
			});

			if (service === 'dead') {
				await tx.stock_request.updateMany({
					where: {
						stock_handover_no: stock_handover_no,
					},
					data: {
						status: 61,
					},
				});
				console.log(`Updated stock_request status to 61 for stock_handover_no: ${stock_handover_no}`);
			}
			await Promise.all(
				products.map(async (product) => {
					const quantityForService = await prisma.stock_req_product.findFirst({
						where: {
							stock_handover_no: stock_handover_no,
							serial_no: product,
						},
						select: {
							quantity: true,
						},
					});



					const data = await tx.service_req_product.create({
						data: {
							service_no: service_no,
							serial_no: product, 
							inventoryId: inventoryId,
							quantity: quantityForService?.quantity,
						},
					});

					// const data = await tx.service_req_product.upsert({
					// 	where: {
					// 		serial_no: product,  
					// 	},
					// 	update: {
					// 		quantity: quantityForService?.quantity,  
					// 		inventoryId: inventoryId,  
					// 	},
					// 	create: {
					// 		service_no: service_no,
					// 		serial_no: product, 
					// 		inventoryId: inventoryId,
					// 		quantity: quantityForService?.quantity,
					// 	},
					// });
					console.log("===========data ================",data)

					await tx.stock_req_product.update({
						where: {
							stock_handover_no_serial_no: {
								stock_handover_no: stock_handover_no,
								serial_no: product,
							},
						},
						data: {
							is_available: false,
						},
					});
				})
			);

			await tx.dist_service_req_outbox.create({
				data: {
					service_no: service_no,
				},
			});

			await tx.da_service_req_inbox.create({
				data: {
					service_no: service_no,
				},
			});

			if (service === 'return') {
				await tx.ia_service_req_inbox.create({
					data: {
						service_no: service_no,
					},
				});
				await tx.notification.create({
					data: {
						role_id: Number(process.env.ROLE_IA),
						title: 'New Service request',
						destination: 81,
						description: `There is a ${serviceTranslator(service)}. Service Number : ${service_no}`,
						ulb_id,
					},
				});
			}

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'New Service request',
					destination: 26,
					description: `There is a ${serviceTranslator(service)}. Service Number : ${service_no}`,
					ulb_id,
				},
			});

			await tx.dist_service_req_inbox.create({
				data: {
					service_no: service_no,
				},
			});
		});

		return serviceReq;
	} catch (err: any) {
		console.log(err);
		return { error: true, message: err?.message };
	}
};


export const getServiceReqInboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.dist_service_req_inboxWhereInput = {}
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

export const getServiceReqOutboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.dist_service_req_outboxWhereInput = {}
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
		count = await prisma.dist_service_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.dist_service_req_outbox.findMany({
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

/*
Author - Anil Tigga
Status - Open
*/

import { Request } from 'express'
import { PrismaClient, Prisma, service_request, service_enum } from '@prisma/client'
import { serviceTranslator } from '../distributor/distServiceReq.dal'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'
import { imageUploaderV2 } from '../../lib/imageUploaderV2'
import { extractRoleName } from '../../lib/roleNameExtractor'
import generateServiceNumber from '../../lib/serviceNumberGenerator'

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
		count = await prisma.ia_service_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.ia_service_req_inbox.findMany({
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
		count = await prisma.ia_service_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.ia_service_req_outbox.findMany({
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
	const { service_no, remark }: { service_no: string; remark: string } = req.body
	const doc = req.files

	try {
		const serviceReq = await prisma.service_request.findFirst({
			where: {
				service_no: service_no,
			},
			select: {
				service_no: true,
				stock_handover_no: true,
				stock_request: {
					select: {
						emp_id: true
					}
				},
				status: true,
				service: true,
				inventory: {
					select: {
						subcategory: {
							select: {
								name: true,
							},
						},
					},
				},
				service_req_product: true,
			},
		})

		if (serviceReq?.service === 'dead' && doc?.length === 0) {
			throw { error: true, message: 'For dead stock request, document is mandatory' }
		}

		if (serviceReq?.status !== 20) {
			throw { error: true, message: 'Invalid status of service request to be approved' }
		}

		const serviceReqProd = await prisma.service_req_product.findMany({
			where: {
				service_no: service_no,
			},
		})

		const distOutbox = await prisma.dist_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		const daOutbox = await prisma.da_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		//start transaction
		await prisma.$transaction(async tx => {
			if (serviceReq?.service === 'dead') {
				await Promise.all(
					serviceReqProd.map(async prod => {
						await addToDeadStock(prod?.serial_no, prod.quantity, remark, doc, String(serviceReq?.inventory?.subcategory?.name), tx, serviceReq?.service_no, serviceReq?.stock_handover_no)
					})
				)
			}

			if (serviceReq?.service === 'warranty') {
				await Promise.all(
					serviceReqProd.map(async prod => {
						await warrantyClaim(prod?.serial_no, remark, String(serviceReq?.inventory?.subcategory?.name), tx, serviceReq?.service_no, serviceReq?.stock_handover_no)
					})
				)
			}

			if (serviceReq?.service === 'return') {
				await Promise.all(
					serviceReqProd.map(async prod => {
						await returnToInventory(prod?.serial_no, prod.quantity, String(serviceReq?.inventory?.subcategory?.name), tx, serviceReq?.service_no, serviceReq?.stock_handover_no, serviceReq?.stock_request?.emp_id)
					})
				)
			}

			await tx.ia_service_req_inbox.delete({
				where: {
					service_no: service_no,
				},
			})

			await tx.ia_service_req_outbox.create({
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

			if (serviceReq?.service !== 'return') {
				await tx.da_service_req_inbox.create({
					data: {
						service_no: service_no,
					},
				})
			} else {
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
			}

			if (daOutbox > 0) {
				await tx.da_service_req_outbox.delete({
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
					status: 23,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DIST),
					title: 'Service request approved',
					destination: 41,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: `${serviceTranslator(serviceReq?.service)} approved. Service Number : ${service_no}`,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'Service request approved',
					destination: 26,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: `${serviceTranslator(serviceReq?.service)} approved. Service Number : ${service_no}`,
				},
			})
		})

		return 'Approved by IA'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const rejectServiceRequestDal = async (req: Request) => {
	const { service_no, remark }: { service_no: string, remark: string } = req.body

	try {

		if (!service_no && !remark) {
			throw { error: true, message: 'Both service number and remark are required' }
		}

		const serviceReq = await prisma.service_request.findFirst({
			where: {
				service_no: service_no,
			},
			select: {
				status: true,
				service: true,
			},
		})

		if (serviceReq?.status !== 20) {
			throw { error: true, message: 'Invalid status of service request to be rejected' }
		}

		const distOutbox = await prisma.dist_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		const daOutbox = await prisma.da_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.ia_service_req_inbox.delete({
				where: {
					service_no: service_no,
				},
			})

			await tx.ia_service_req_outbox.create({
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

			if (serviceReq?.service !== 'return') {
				await tx.da_service_req_inbox.create({
					data: {
						service_no: service_no,
					},
				})
			} else {
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
			}

			if (daOutbox > 0) {
				await tx.da_service_req_outbox.delete({
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
					remark: remark as string
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DIST),
					title: 'Service request rejected',
					destination: 41,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: `${serviceTranslator(serviceReq?.service)} rejected. Service Number : ${service_no}`,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'Service request rejected',
					destination: 26,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: `${serviceTranslator(serviceReq?.service)} rejected. Service Number : ${service_no}`,
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
	const { service_no }: { service_no: string } = req.body

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

		if (!serviceReq) {
			throw { error: true, message: 'Invalid service number' }
		}

		if (serviceReq?.status !== 20) {
			throw { error: true, message: 'Invalid status of service request to be returned' }
		}

		const distOutbox = await prisma.dist_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		const daOutbox = await prisma.da_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.ia_service_req_inbox.delete({
				where: {
					service_no: service_no,
				},
			})

			await tx.ia_service_req_outbox.create({
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

			await tx.da_service_req_inbox.create({
				data: {
					service_no: service_no,
				},
			})

			if (daOutbox > 0) {
				await tx.da_service_req_outbox.delete({
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
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DIST),
					title: 'Service request returned from IA',
					destination: 41,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: `${serviceTranslator(serviceReq?.service)} returned from IA. Service Number : ${service_no}`,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'Service request returned from IA',
					destination: 26,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: `${serviceTranslator(serviceReq?.service)} returned from IA. Service Number : ${service_no}`,
				},
			})
		})

		return 'returned from IA'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

const addToDeadStock = async (serial_no: string, quantity: number, remark: string, doc: any, subcategory_name: string, tx: Prisma.TransactionClient, service_no?: string, stock_handover_no?: string) => {

	const product = await prisma
		.$queryRawUnsafe(
			`
					SELECT *
					FROM product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
					WHERE serial_no = '${serial_no as string}'
				`
		)
		.then((result: any) => result[0])


	// if (Number(product?.quantity) - quantity < 0) {
	// 	throw { error: true, message: 'Provided quantity is more than available quantity' }
	// }

	if ((Number(product?.quantity) - quantity) < 0) {
		throw new Error('No more quantity avalable')
	}

	await tx.$queryRawUnsafe(`
			UPDATE product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
			SET is_available = false, is_dead = true, quantity=${Number(product?.quantity) - quantity}
			WHERE serial_no = '${serial_no as string}'
		`)

	await tx.inventory.update({
		where: {
			id: product?.inventory_id,
		},
		data: {
			quantity: {
				decrement: quantity,
			},
		},
	})

	const invDeadStock = await tx.inventory_dead_stock.create({
		data: {
			inventoryId: product?.inventory_id,
			serial_no: product?.serial_no,
			quantity: quantity,
			remark2: remark,
		},
	})

	const uploaded = await imageUploaderV2(doc)

	await Promise.all(
		uploaded.map(async item => {
			await tx.inventory_dead_stock_image.create({
				data: {
					doc_path: item,
					uploader: 'IA',
					inventory_dead_stockId: invDeadStock?.id,
				},
			})
		})
	)

	if (stock_handover_no && service_no) {
		await tx.service_history.create({
			data: {
				stock_handover_no: stock_handover_no,
				service_no: service_no,
				serial_no: serial_no,
				quantity: quantity,
				service: 'dead',
				// inventory: { connect: { id: product?.inventory_id } },
				inventoryId: product?.inventory_id,
			},
		})
	}
}

const warrantyClaim = async (serial_no: string, remark: string, subcategory_name: string, tx: Prisma.TransactionClient, service_no?: string, stock_handover_no?: string) => {
	const product = await prisma
		.$queryRawUnsafe(
			`
					SELECT *
					FROM product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
					WHERE serial_no = '${serial_no as string}'
				`
		)
		.then((result: any) => result[0])

	const inv = await prisma.inventory.findFirst({
		where: {
			id: product?.inventory_id,
		},
		select: {
			warranty: true,
			quantity: true
		},
	})

	if (Number(!inv?.warranty)) {
		throw { error: true, message: 'No warranty for the selected item' }
	}

	if (!product?.quantity) {
		throw { error: true, message: 'No item avalable' }
	}

	await tx.inventory_warranty.create({
		data: {
			inventoryId: product?.inventory_id,
			serial_no: product?.serial_no,
			quantity: product?.quantity,
			remark2: remark,
		},
	})

	if (stock_handover_no && service_no) {
		await tx.stock_req_product.update({
			where: {
				stock_handover_no_serial_no: {
					stock_handover_no: stock_handover_no,
					serial_no: product?.serial_no
				}
			},
			data: {
				is_available: true
			},
		})


		await tx.service_history.create({
			data: {
				stock_handover_no: stock_handover_no,
				service_no: service_no,
				serial_no: serial_no,
				service: 'warranty',
				// inventory: { connect: { id: product?.inventory_id } },
				inventoryId: product?.inventory_id,
			},
		})
	}
}

const returnToInventory = async (serial_no: string, quantity: number, subcategory_name: string, tx: Prisma.TransactionClient, service_no: string, stock_handover_no: string, emp_id: string) => {
	const product = await prisma
		.$queryRawUnsafe(
			`
					SELECT *
					FROM product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
					WHERE serial_no = '${serial_no as string}'
				`
		)
		.then((result: any) => result[0])

	await tx.$queryRawUnsafe(`
			UPDATE product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
			SET is_available = true, quantity=${product?.quantity + quantity}
			WHERE serial_no = '${serial_no as string}'
		`)

	await tx.inventory.update({
		where: {
			id: product?.inventory_id,
		},
		data: {
			quantity: {
				increment: quantity,
			},
		},
	})

	await tx.stock_handover.update({
		where: {
			emp_id_serial_no: {
				emp_id: emp_id,
				serial_no: serial_no
			}
		},
		data: {
			return_date: new Date(),
			is_alloted: false
		}
	})

	await tx.service_history.create({
		data: {
			stock_handover_no: stock_handover_no,
			service_no: service_no,
			serial_no: serial_no,
			quantity: quantity,
			service: 'return',
			// inventory: { connect: { id: product?.inventory_id } },
			inventoryId: product?.inventory_id,
		},
	})
}

// const returnToInventory = async (serial_no: string, quantity: number, subcategory_name: string, tx: Prisma.TransactionClient) => {
// 	const product = await prisma
// 		.$queryRawUnsafe(
// 			`
// 					SELECT *
// 					FROM product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
// 					WHERE serial_no = '${serial_no as string}'
// 				`
// 		)
// 		.then((result: any) => result[0])

// 	await tx.$queryRawUnsafe(`
// 			UPDATE product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
// 			SET is_available = true,
// 			WHERE serial_no = '${serial_no as string}'
// 		`)

// 	await tx.inventory.update({
// 		where: {
// 			id: product?.inventory_id,
// 		},
// 		data: {
// 			quantity: {
// 				increment: quantity,
// 			},
// 		},
// 	})
// }


export const createServiceRequestByIaDal = async (req: Request) => {
	const { product, quantity, service, inventoryId, remark } = req.body
	const doc = req.files

	// const ulb_id = auth?.ulb_id

	try {

		if (service === 'dead' && !quantity) {
			throw new Error('Quantity is required for dead stock')
		}

		const inventoryData = await prisma.inventory.findFirst({
			where: {
				id: inventoryId
			},
			include: {
				category: true,
				subcategory: true
			}
		})

		if (!inventoryData) {
			throw new Error('No inventory data found')
		}

		// 	const productData = await prisma.$queryRawUnsafe(
		// 		`
		// 			SELECT *
		// 			FROM product.product_${inventoryData?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
		// 			WHERE inventory_id = '${inventoryId as string}'
		// `
		// 	)
		// 		.then((result: any) => result[0])


		// start transaction
		await prisma.$transaction(async tx => {
			if (inventoryData?.subcategory?.name) {
				if (service === 'dead') {
					await addToDeadStock(product, Number(quantity), remark, doc, inventoryData?.subcategory?.name, tx)
				}
				if (service === 'warranty') {
					await warrantyClaim(product, remark, inventoryData?.subcategory?.name, tx)
				}
			}
		})

		return 'Successfull'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}
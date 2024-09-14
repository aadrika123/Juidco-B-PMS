/*
Author - Anil Tigga
Status - Open
*/

import { Request } from 'express'
import { PrismaClient, Prisma, emp_service_request, service_enum } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'
import { imageUploaderV2 } from '../../lib/imageUploaderV2'
import { extractRoleName } from '../../lib/roleNameExtractor'

const prisma = new PrismaClient()

const serviceTranslator = (service: service_enum): string => {
	let result: string
	switch (service) {
		case 'return':
			result = 'Employee Return Request'
			break
		case 'warranty':
			result = 'EmployeeWarranty Claim Request'
			break
		case 'dead':
			result = 'Employee Dead Stock Request'
			break
	}
	return result
}

export const getEmpServiceReqInboxDal = async (req: Request) => {
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
				emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
		count = await prisma.dist_emp_service_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.dist_emp_service_req_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				service_no: true,
				emp_service_req: {
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
			const temp = { ...item?.emp_service_req }
			delete item.emp_service_req
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

export const getEmpServiceReqOutboxDal = async (req: Request) => {
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
				emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
		count = await prisma.dist_emp_service_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.dist_emp_service_req_outbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				service_no: true,
				emp_service_req: {
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
			const temp = { ...item?.emp_service_req }
			delete item.emp_service_req
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

export const approveEmpServiceRequestDal = async (req: Request) => {
	const { service_no }: { service_no: string } = req.body

	try {
		const serviceReq = await prisma.emp_service_request.findFirst({
			where: {
				service_no: service_no,
			},
			select: {
				service_no: true,
				stock_handover_no: true,
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
				emp_service_req_product: true,
			},
		})

		if (serviceReq?.status !== 10) {
			throw { error: true, message: 'Invalid status of service request to be approved' }
		}

		const empOutbox = await prisma.emp_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		//start transaction
		await prisma.$transaction(async tx => {

			await tx.dist_emp_service_req_inbox.delete({
				where: {
					service_no: service_no,
				},
			})

			await tx.dist_emp_service_req_outbox.create({
				data: {
					service_no: service_no,
				},
			})

			await tx.emp_service_req_inbox.create({
				data: {
					service_no: service_no,
				},
			})

			if (empOutbox > 0) {
				await tx.emp_service_req_outbox.delete({
					where: {
						service_no: service_no,
					},
				})
			}

			await tx.emp_service_request.update({
				where: {
					service_no: service_no,
				},
				data: {
					status: 13,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'Service request approved',
					destination: 100,
					from: await extractRoleName(Number(process.env.ROLE_DIST)),
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
		const serviceReq = await prisma.emp_service_request.findFirst({
			where: {
				service_no: service_no,
			},
			select: {
				status: true,
				service: true,
				stock_handover_no: true,
				emp_service_req_product: {
					select: {
						serial_no: true
					}
				}
			},
		})

		if (serviceReq?.status !== 10) {
			throw { error: true, message: 'Invalid status of service request to be rejected' }
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.dist_emp_service_req_inbox.delete({
				where: {
					service_no: service_no,
				},
			})

			await tx.dist_emp_service_req_outbox.create({
				data: {
					service_no: service_no,
				},
			})


			await tx.emp_service_req_inbox.create({
				data: {
					service_no: service_no,
				},
			})

			await tx.emp_service_req_outbox.delete({
				where: {
					service_no: service_no,
				},
			})

			await tx.emp_service_request.update({
				where: {
					service_no: service_no,
				},
				data: {
					status: 12,
					remark: remark
				},
			})

			await Promise.all(
				serviceReq?.emp_service_req_product.map(async product => {
					await tx.stock_req_product.update({
						where: {
							stock_handover_no_serial_no: {
								stock_handover_no: serviceReq?.stock_handover_no,
								serial_no: product?.serial_no
							}
						},
						data: {
							is_available: true
						},
					})
				})
			)

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_EMP),
					title: 'Service request rejected',
					destination: 100,
					from: await extractRoleName(Number(process.env.ROLE_DIST)),
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

const addToDeadStock = async (serial_no: string, quantity: number, remark: string, doc: any, subcategory_name: string, tx: Prisma.TransactionClient, service_no: string, stock_handover_no: string) => {
	const product = await prisma
		.$queryRawUnsafe(
			`
					SELECT *
					FROM product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
					WHERE serial_no = '${serial_no as string}'
				`
		)
		.then((result: any) => result[0])

	if (Number(product?.quantity) - quantity < 0) {
		throw { error: true, message: 'Provided quantity is more than available quantity' }
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

	uploaded.map(async item => {
		await tx.inventory_dead_stock_image.create({
			data: {
				doc_path: item,
				uploader: 'IA',
				inventory_dead_stockId: invDeadStock?.id,
			},
		})
	})

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

const warrantyClaim = async (serial_no: string, remark: string, subcategory_name: string, tx: Prisma.TransactionClient, service_no: string, stock_handover_no: string) => {
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
		},
	})

	if (Number(!inv?.warranty)) {
		throw { error: true, message: 'No warranty for the selected item' }
	}

	await tx.inventory_warranty.create({
		data: {
			inventoryId: product?.inventory_id,
			serial_no: product?.serial_no,
			quantity: product?.quantity,
			remark2: remark,
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

const returnToInventory = async (serial_no: string, quantity: number, subcategory_name: string, tx: Prisma.TransactionClient, service_no: string, stock_handover_no: string) => {
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

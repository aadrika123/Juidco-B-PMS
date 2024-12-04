import { Request } from 'express'
import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient, service_enum, service_request } from '@prisma/client'
import { serviceTranslator } from '../distributor/distServiceReq.dal'
import { extractRoleName } from '../../lib/roleNameExtractor'

const prisma = new PrismaClient()

export const getServiceReqByServiceNoDal = async (req: Request) => {
	const { service_no } = req.params
	try {
		const result = await prisma.service_request.findFirst({
			where: {
				service_no: service_no,
			},
			select: {
				id: true,
				stock_handover_no: true,
				service_no: true,
				status: true,
				createdAt: true,
				remark: true,
				service: true,
				inventory: {
					select: {
						id: true,
						description: true,
						category: {
							select: {
								id: true,
								name: true,
							},
						},
						subcategory: {
							select: {
								id: true,
								name: true,
							},
						},
						brand: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				service_req_product: {
					select: {
						serial_no: true,
						quantity: true,
						status: true,
					},
				},
			},
		})
		// let resultToSend: any = {}

		// const temp = { ...result?.procurement }
		// delete result.procurement
		// resultToSend = { ...result, ...temp }

		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

type reqType = {
	products: productType[]
	service_no: string
	service: service_enum
	stock_handover_no: string
	inventoryId: string
}

type productType = {
	serial_no: string
}

export const editServiceRequestDal = async (req: Request) => {
	const { service_no, products, service, stock_handover_no, inventoryId }: reqType = req.body
	const ulb_id = req?.body?.auth?.ulb_id

	try {
		const data: Omit<service_request, 'createdAt' | 'updatedAt' | 'remark' | 'id'> = {
			service_no: service_no,
			stock_handover_no: stock_handover_no,
			service: service,
			inventoryId: inventoryId,
			status: service === 'return' ? 20 : 10,
			ulb_id: ulb_id
		}

		let serviceReq: any

		//start transaction
		await prisma.$transaction(async tx => {
			serviceReq = await tx.service_request.create({
				data: data,
			})

			await Promise.all(
				products.map(async product => {
					await tx.service_req_product.create({
						data: {
							service_no: service_no,
							serial_no: product?.serial_no,
							inventoryId: inventoryId,
						},
					})
				})
			)

			await tx.dist_service_req_outbox.create({
				data: {
					service_no: service_no,
				},
			})

			await tx.da_service_req_inbox.create({
				data: {
					service_no: service_no,
				},
			})
			if (service === 'return') {
				await tx.ia_service_req_inbox.create({
					data: {
						service_no: service_no,
					},
				})
				await tx.notification.create({
					data: {
						role_id: Number(process.env.ROLE_IA),
						title: 'New Service request',
						destination: 81,
						from: await extractRoleName(Number(process.env.ROLE_DIST)),
						description: `There is a ${serviceTranslator(service)}. Service Number : ${service_no}`,
						ulb_id
					},
				})
			}
			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'New Service request',
					destination: 26,
					from: await extractRoleName(Number(process.env.ROLE_DIST)),
					description: `There is a ${serviceTranslator(service)}. Service Number : ${service_no}`,
					ulb_id
				},
			})
		})

		return serviceReq
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

import { Request } from 'express'
import { PrismaClient, Prisma } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const getStockReqInboxDal = async (req: Request) => {
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

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				stock_handover_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				emp_id: {
					description: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	if (category[0] || subcategory[0] || brand[0]) {
		whereClause.AND = [
			...(category[0]
				? [
						{
							stock_request: {
								category_masterId: {
									in: category,
								},
							},
						},
					]
				: []),
			...(subcategory[0]
				? [
						{
							stock_request: {
								subcategory_masterId: {
									in: subcategory,
								},
							},
						},
					]
				: []),
			...(brand[0]
				? [
						{
							stock_request: {
								brand_masterId: {
									in: brand,
								},
							},
						},
					]
				: []),
			...(status[0]
				? [
						{
							stock_request: {
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
		count = await prisma.sr_stock_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.sr_stock_req_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				stock_handover_no: true,
				stock_request: {
					select: {
						stock_handover_no: true,
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
						ulb_id: true,
						emp_id: true,
						emp_name: true,
						allotted_quantity: true,
						isEdited: true,
						status: true,
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.stock_request }
			delete item.stock_request
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

export const getStockReqOutboxDal = async (req: Request) => {
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

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				stock_handover_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				emp_id: {
					description: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	if (category[0] || subcategory[0] || brand[0]) {
		whereClause.AND = [
			...(category[0]
				? [
						{
							stock_request: {
								category_masterId: {
									in: category,
								},
							},
						},
					]
				: []),
			...(subcategory[0]
				? [
						{
							stock_request: {
								subcategory_masterId: {
									in: subcategory,
								},
							},
						},
					]
				: []),
			...(brand[0]
				? [
						{
							stock_request: {
								brand_masterId: {
									in: brand,
								},
							},
						},
					]
				: []),
			...(status[0]
				? [
						{
							stock_request: {
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
		count = await prisma.sr_stock_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.sr_stock_req_outbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				stock_handover_no: true,
				stock_request: {
					select: {
						stock_handover_no: true,
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
						ulb_id: true,
						emp_id: true,
						emp_name: true,
						allotted_quantity: true,
						isEdited: true,
						status: true,
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.stock_request }
			delete item.stock_request
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

export const forwardToIaDal = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string[] } = req.body

	try {
		await Promise.all(
			stock_handover_no.map(async (item: string) => {
				const stockReq = await prisma.stock_request.findFirst({
					where: { stock_handover_no: item },
					select: {
						status: true,
					},
				})

				if (!stockReq) {
					throw { error: true, message: 'Invalid stock handover' }
				}

				if (stockReq?.status < 1 || stockReq?.status > 2) {
					throw { error: true, message: 'Stock request is not valid to be forwarded' }
				}

				// const product = await prisma
				// 	.$queryRawUnsafe(
				// 		`
				// 		SELECT *
				// 		FROM product.product_${stockReq?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
				// 		WHERE is_available = true AND inventory_id = '${stockReq?.inventoryId as string}'
				// 		LIMIT 1
				// 		`
				// 	)
				// 	.then((result: any) => result[0])

				// if (!product) {
				// 	throw { error: true, message: 'No product available' }
				// }

				const iaOutboxCount: number = await prisma.ia_stock_req_outbox.count({
					where: {
						stock_handover_no: item,
					},
				})

				await prisma.$transaction([
					prisma.da_stock_req_outbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.ia_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					// prisma.$queryRawUnsafe(`
					// 	UPDATE product.product_${stockReq?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
					// 	SET is_available = false
					// 	WHERE serial_no = '${product?.serial_no as string}'
					// `),
					// prisma.stock_request.update({
					// 	where: {
					// 		stock_handover_no: item,
					// 	},
					// 	data: {
					// 		status: 3,
					// 		serial_no: product?.serial_no as string,
					// 	},
					// }),
					// prisma.inventory.update({
					// 	where: { id: stockReq?.inventoryId as string },
					// 	data: {
					// 		quantity: {
					// 			decrement: Number(stockReq?.allotted_quantity),
					// 		},
					// 	},
					// }),
					// prisma.inventory_buffer.delete({
					// 	where: { stock_handover_no: item },
					// }),
					prisma.da_stock_req_inbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.dist_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					...(iaOutboxCount !== 0
						? [
								prisma.ia_stock_req_outbox.delete({
									where: {
										stock_handover_no: item,
									},
								}),
							]
						: []),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.IA),
							title: 'New stock request',
							destination: 80,
							description: `There is a new stock request to be reviewed  : ${item}`,
						},
					}),
				])
			})
		)
		return 'Forwarded'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

// export const returnStockReqDal = async (req: Request) => {
// 	const { stock_handover_no, remark }: { stock_handover_no: string[]; remark: string } = req.body

// 	try {
// 		await Promise.all(
// 			stock_handover_no.map(async (item: string) => {
// 				const status: any = await prisma.stock_request.findFirst({
// 					where: {
// 						stock_handover_no: item,
// 					},
// 					select: {
// 						status: true,
// 					},
// 				})
// 				if (status?.status < 1 || status?.status > 2) {
// 					throw { error: true, message: 'Stock request is not valid to be returned' }
// 				}

// 				await prisma.$transaction([
// 					prisma.da_stock_req_outbox.create({
// 						data: { stock_handover_no: item },
// 					}),
// 					prisma.dist_stock_req_inbox.create({
// 						data: { stock_handover_no: item },
// 					}),
// 					prisma.stock_request.update({
// 						where: {
// 							stock_handover_no: item,
// 						},
// 						data: {
// 							status: -1,
// 						},
// 					}),
// 					prisma.da_stock_req_inbox.delete({
// 						where: {
// 							stock_handover_no: item,
// 						},
// 					}),
// 					prisma.dist_stock_req_outbox.delete({
// 						where: {
// 							stock_handover_no: item,
// 						},
// 					}),
// 					prisma.notification.create({
// 						data: {
// 							role_id: Number(process.env.ROLE_DIST),
// 							title: 'Stock returned',
// 							destination: 40,
// 							description: `stock request : ${item} has returned`,
// 						},
// 					}),
// 				])
// 			})
// 		)
// 		return 'Returned'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

// export const rejectStockReqDal = async (req: Request) => {
// 	const { stock_handover_no }: { stock_handover_no: string[] } = req.body

// 	try {
// 		await Promise.all(
// 			stock_handover_no.map(async (item: string) => {
// 				const status: any = await prisma.stock_request.findFirst({
// 					where: {
// 						stock_handover_no: item,
// 					},
// 					select: {
// 						status: true,
// 					},
// 				})
// 				if (status?.status < 1 || status?.status > 2) {
// 					throw { error: true, message: 'Stock request is not valid to be rejected' }
// 				}

// 				await prisma.$transaction([
// 					prisma.da_stock_req_outbox.create({
// 						data: { stock_handover_no: item },
// 					}),
// 					prisma.dist_stock_req_inbox.create({
// 						data: { stock_handover_no: item },
// 					}),
// 					prisma.stock_request.update({
// 						where: {
// 							stock_handover_no: item,
// 						},
// 						data: {
// 							status: -2,
// 						},
// 					}),
// 					prisma.da_stock_req_inbox.delete({
// 						where: {
// 							stock_handover_no: item,
// 						},
// 					}),
// 					prisma.dist_stock_req_outbox.delete({
// 						where: {
// 							stock_handover_no: item,
// 						},
// 					}),
// 					prisma.notification.create({
// 						data: {
// 							role_id: Number(process.env.ROLE_DIST),
// 							title: 'Stock rejected',
// 							destination: 40,
// 							description: `stock request : ${item} has rejected`,
// 						},
// 					}),
// 				])
// 			})
// 		)
// 		return 'Returned'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

// export const stockReturnApprovalDal = async (req: Request) => {
// 	const { stock_handover_no }: { stock_handover_no: string } = req.body

// 	try {
// 		const stockReq = await prisma.stock_request.findFirst({
// 			where: {
// 				stock_handover_no: stock_handover_no,
// 			},
// 			select: {
// 				status: true,
// 				serial_no: true,
// 				inventoryId: true,
// 				allotted_quantity: true,
// 				subcategory: {
// 					select: {
// 						name: true,
// 					},
// 				},
// 			},
// 		})

// 		if (stockReq?.status !== 5) {
// 			throw { error: true, message: 'Stock return request is not valid' }
// 		}

// 		await prisma.$transaction(async tx => {
// 			await tx.$queryRawUnsafe(`
// 				UPDATE product.product_${stockReq?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
// 				SET is_available = true
// 				WHERE serial_no = '${stockReq?.serial_no as string}'
// 			`)

// 			await tx.inventory.update({
// 				where: {
// 					id: stockReq?.inventoryId as string,
// 				},
// 				data: {
// 					quantity: {
// 						increment: Number(stockReq?.allotted_quantity),
// 					},
// 				},
// 			})

// 			await tx.sr_stock_req_outbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.dist_stock_req_inbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.stock_request.update({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 				data: {
// 					status: 51,
// 				},
// 			})

// 			await tx.sr_stock_req_inbox.delete({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 			})

// 			await tx.notification.create({
// 				data: {
// 					role_id: Number(process.env.ROLE_DIST),
// 					title: 'Stock returned to inventory',
// 					destination: 40,
// 					description: `Return request for ${stock_handover_no} has been successfully approved and added to inventory`,
// 				},
// 			})
// 		})

// 		return 'returned to inventory'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

// export const stockReturnRejectDal = async (req: Request) => {
// 	const { stock_handover_no, remark }: { stock_handover_no: string; remark: string } = req.body

// 	try {
// 		const stockReq = await prisma.stock_request.findFirst({
// 			where: {
// 				stock_handover_no: stock_handover_no,
// 			},
// 			select: {
// 				status: true,
// 			},
// 		})

// 		if (stockReq?.status !== 5) {
// 			throw { error: true, message: 'Stock return request is not valid' }
// 		}

// 		await prisma.$transaction(async tx => {
// 			await tx.sr_stock_req_outbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.dist_stock_req_inbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.stock_request.update({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 				data: {
// 					status: -5,
// 					remark: remark,
// 				},
// 			})

// 			await tx.sr_stock_req_inbox.delete({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 			})

// 			await tx.notification.create({
// 				data: {
// 					role_id: Number(process.env.ROLE_DIST),
// 					title: 'Stock return request rejected',
// 					destination: 40,
// 					description: `Return request for ${stock_handover_no} has been rejected`,
// 				},
// 			})
// 		})

// 		return 'return request rejected'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

// export const stockReturnReqReturnDal = async (req: Request) => {
// 	const { stock_handover_no, remark }: { stock_handover_no: string; remark: string } = req.body

// 	try {
// 		const stockReq = await prisma.stock_request.findFirst({
// 			where: {
// 				stock_handover_no: stock_handover_no,
// 			},
// 			select: {
// 				status: true,
// 			},
// 		})

// 		if (stockReq?.status !== 5) {
// 			throw { error: true, message: 'Stock return request is not valid' }
// 		}

// 		await prisma.$transaction(async tx => {
// 			await tx.sr_stock_req_outbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.dist_stock_req_inbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.stock_request.update({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 				data: {
// 					status: 52,
// 					remark: remark,
// 				},
// 			})

// 			await tx.sr_stock_req_inbox.delete({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 			})

// 			await tx.notification.create({
// 				data: {
// 					role_id: Number(process.env.ROLE_DIST),
// 					title: 'Stock return request returned back',
// 					destination: 40,
// 					description: `Return request for ${stock_handover_no} has been Returned back`,
// 				},
// 			})
// 		})

// 		return 'returned back to departmental distributor'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

// const addToDeadStock = async (serial_no: string, subcategory_name: string, tx: Prisma.TransactionClient) => {
// 	const product = await prisma
// 		.$queryRawUnsafe(
// 			`
// 				SELECT * 
// 				FROM product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
// 				WHERE serial_no = '${serial_no as string}'
// 			`
// 		)
// 		.then((result: any) => result[0])

// 	await tx.$queryRawUnsafe(`
// 		UPDATE product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
// 		SET is_available = false, is_dead = true
// 		WHERE serial_no = '${serial_no as string}'
// 	`)

// 	await tx.inventory_dead_stock.create({
// 		data: {
// 			inventoryId: product?.inventory_id,
// 			serial_no: product?.serial_no,
// 			quantity: product?.quantity,
// 		},
// 	})

// 	const stockReq = await prisma.stock_request.count({
// 		where: {
// 			serial_no: serial_no,
// 		},
// 	})

// 	if (stockReq === 0) {
// 		await tx.inventory.update({
// 			where: {
// 				id: product?.inventory_id,
// 			},
// 			data: {
// 				quantity: {
// 					decrement: Number(product?.quantity),
// 				},
// 			},
// 		})
// 	} else {
// 		await tx.stock_request.update({
// 			where: {
// 				serial_no: serial_no,
// 			},
// 			data: {
// 				status: 61,
// 			},
// 		})
// 	}
// }

// export const deadStockForwardDal = async (req: Request) => {
// 	const { stock_handover_no }: { stock_handover_no: string } = req.body

// 	try {
// 		const stockReq = await prisma.stock_request.findFirst({
// 			where: {
// 				stock_handover_no: stock_handover_no,
// 			},
// 			select: {
// 				status: true,
// 				inventoryId: true,
// 				allotted_quantity: true,
// 				subcategory: {
// 					select: {
// 						name: true,
// 					},
// 				},
// 			},
// 		})

// 		if (!stockReq) {
// 			throw { error: true, message: 'Invalid stock request' }
// 		}

// 		if (stockReq?.status !== 6) {
// 			throw { error: true, message: 'Dead stock request is not valid' }
// 		}

// 		await prisma.$transaction(async tx => {
// 			await addToDeadStock(stockReq?.serial_no as string, stockReq?.subcategory?.name as string, tx)

// 			await tx.sr_stock_req_outbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.dist_stock_req_inbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.stock_request.update({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 				data: {
// 					status: 51,
// 				},
// 			})

// 			await tx.sr_stock_req_inbox.delete({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 			})

// 			await tx.notification.create({
// 				data: {
// 					role_id: Number(process.env.ROLE_DIST),
// 					title: 'Stock added to dead stock',
// 					destination: 40,
// 					description: `Dead stock request for ${stock_handover_no} has been successfully approved and added to dead stock`,
// 				},
// 			})
// 		})

// 		return 'added to dead stock'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

// export const deadStockRejectDal = async (req: Request) => {
// 	const { stock_handover_no, remark }: { stock_handover_no: string; remark: string } = req.body

// 	try {
// 		const stockReq = await prisma.stock_request.findFirst({
// 			where: {
// 				stock_handover_no: stock_handover_no,
// 			},
// 			select: {
// 				status: true,
// 			},
// 		})

// 		if (stockReq?.status !== 6) {
// 			throw { error: true, message: 'Dead stock request is not valid' }
// 		}

// 		await prisma.$transaction(async tx => {
// 			await tx.sr_stock_req_outbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.dist_stock_req_inbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.stock_request.update({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 				data: {
// 					status: -6,
// 					remark: remark,
// 				},
// 			})

// 			await tx.sr_stock_req_inbox.delete({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 			})

// 			await tx.notification.create({
// 				data: {
// 					role_id: Number(process.env.ROLE_DIST),
// 					title: 'Dead stock request rejected',
// 					destination: 40,
// 					description: `Dead stock request for ${stock_handover_no} has been rejected`,
// 				},
// 			})
// 		})

// 		return 'Dead stock request rejected'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

// export const deadStockReturnDal = async (req: Request) => {
// 	const { stock_handover_no, remark }: { stock_handover_no: string; remark: String } = req.body

// 	try {
// 		const stockReq = await prisma.stock_request.findFirst({
// 			where: {
// 				stock_handover_no: stock_handover_no,
// 			},
// 			select: {
// 				status: true,
// 			},
// 		})

// 		if (stockReq?.status !== 6) {
// 			throw { error: true, message: 'Dead stock request is not valid' }
// 		}

// 		await prisma.$transaction(async tx => {
// 			await tx.sr_stock_req_outbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.dist_stock_req_inbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.stock_request.update({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 				data: {
// 					status: 62,
// 					remark: remark as string,
// 				},
// 			})

// 			await tx.sr_stock_req_inbox.delete({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 			})

// 			await tx.notification.create({
// 				data: {
// 					role_id: Number(process.env.ROLE_DIST),
// 					title: 'Dead stock request returned',
// 					destination: 40,
// 					description: `Dead stock request for ${stock_handover_no} has been returned`,
// 				},
// 			})
// 		})

// 		return 'Dead stock request returned'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

// export const claimWarrantyDal = async (req: Request) => {
// 	const { stock_handover_no }: { stock_handover_no: string } = req.body

// 	try {
// 		const stockReq = await prisma.stock_request.findFirst({
// 			where: {
// 				stock_handover_no: stock_handover_no,
// 			},
// 			select: {
// 				status: true,
// 				inventoryId: true,
// 				allotted_quantity: true,
// 				subcategory: {
// 					select: {
// 						name: true,
// 					},
// 				},
// 				inventory: {
// 					select: {
// 						warranty: true,
// 					},
// 				},
// 			},
// 		})

// 		if (stockReq?.status !== 7) {
// 			throw { error: true, message: 'Stock request is not valid' }
// 		}

// 		if (!stockReq?.inventory?.warranty) {
// 			throw { error: true, message: 'The item has no option to claim warranty' }
// 		}

// 		await prisma.$transaction(async tx => {
// 			await tx.sr_stock_req_outbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.dist_stock_req_inbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.stock_request.update({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 				data: {
// 					status: 71,
// 				},
// 			})

// 			await tx.sr_stock_req_inbox.delete({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 			})

// 			await tx.notification.create({
// 				data: {
// 					role_id: Number(process.env.ROLE_DIST),
// 					title: 'Warranty claimed',
// 					destination: 40,
// 					description: `Warranty claim request for ${stock_handover_no} has been successfully approved`,
// 				},
// 			})
// 		})

// 		return 'Warranty claimed successfully'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

// export const warrantyClaimRejectDal = async (req: Request) => {
// 	const { stock_handover_no, remark }: { stock_handover_no: string; remark: string } = req.body

// 	try {
// 		const stockReq = await prisma.stock_request.findFirst({
// 			where: {
// 				stock_handover_no: stock_handover_no,
// 			},
// 			select: {
// 				status: true,
// 			},
// 		})

// 		if (stockReq?.status !== 7) {
// 			throw { error: true, message: 'Dead stock request is not valid' }
// 		}

// 		await prisma.$transaction(async tx => {
// 			await tx.sr_stock_req_outbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.dist_stock_req_inbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.stock_request.update({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 				data: {
// 					status: -7,
// 					remark: remark,
// 				},
// 			})

// 			await tx.sr_stock_req_inbox.delete({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 			})

// 			await tx.notification.create({
// 				data: {
// 					role_id: Number(process.env.ROLE_DIST),
// 					title: 'Warranty claim rejected',
// 					destination: 40,
// 					description: `Warranty claim request for ${stock_handover_no} has been rejected`,
// 				},
// 			})
// 		})

// 		return 'Warranty claim rejected'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

// export const warrantyClaimReturnDal = async (req: Request) => {
// 	const { stock_handover_no, remark }: { stock_handover_no: string; remark: string } = req.body

// 	try {
// 		const stockReq = await prisma.stock_request.findFirst({
// 			where: {
// 				stock_handover_no: stock_handover_no,
// 			},
// 			select: {
// 				status: true,
// 			},
// 		})

// 		if (stockReq?.status !== 7) {
// 			throw { error: true, message: 'Dead stock request is not valid' }
// 		}

// 		await prisma.$transaction(async tx => {
// 			await tx.sr_stock_req_outbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.dist_stock_req_inbox.create({
// 				data: { stock_handover_no: stock_handover_no },
// 			})

// 			await tx.stock_request.update({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 				data: {
// 					status: 72,
// 					remark: remark,
// 				},
// 			})

// 			await tx.sr_stock_req_inbox.delete({
// 				where: {
// 					stock_handover_no: stock_handover_no,
// 				},
// 			})

// 			await tx.notification.create({
// 				data: {
// 					role_id: Number(process.env.ROLE_DIST),
// 					title: 'Warranty claim returned',
// 					destination: 40,
// 					description: `Warranty claim request for ${stock_handover_no} has been returned`,
// 				},
// 			})
// 		})

// 		return 'Warranty claim returned'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

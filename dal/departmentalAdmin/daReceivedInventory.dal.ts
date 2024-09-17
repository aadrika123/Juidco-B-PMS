import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import generateReceivingNumber from '../../lib/receivingNumberGenerator'
import { imageUploader } from '../../lib/imageUploader'
import axios from 'axios'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

// export const getReceivedInventoryDal = async (req: Request) => {
// 	const page: number | undefined = Number(req?.query?.page)
// 	const take: number | undefined = Number(req?.query?.take)
// 	const startIndex: number | undefined = (page - 1) * take
// 	const endIndex: number | undefined = startIndex + take
// 	let count: number
// 	let totalPage: number
// 	let pagination: pagination = {}
// 	const whereClause: any = {}

// 	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

// 	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
// 	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
// 	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
// 	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

// 	//creating search options for the query
// 	if (search) {
// 		whereClause.OR = [
// 			{
// 				procurement_no: {
// 					contains: search,
// 					mode: 'insensitive',
// 				},
// 			},
// 			{
// 				procurement: {
// 					description: {
// 						contains: search,
// 						mode: 'insensitive',
// 					},
// 				},
// 			},
// 		]
// 	}

// 	//creating filter options for the query
// 	if (category[0]) {
// 		whereClause.procurement = {
// 			category_masterId: {
// 				in: category,
// 			},
// 		}
// 	}
// 	if (subcategory[0]) {
// 		whereClause.procurement = {
// 			subcategory_masterId: {
// 				in: subcategory,
// 			},
// 		}
// 	}
// 	if (status[0]) {
// 		whereClause.procurement = {
// 			status: {
// 				in: status.map(Number),
// 			},
// 		}
// 	}
// 	if (brand[0]) {
// 		whereClause.procurement = {
// 			brand_masterId: {
// 				in: brand,
// 			},
// 		}
// 	}

// 	try {
// 		count = await prisma.da_received_inventory_inbox.count({
// 			where: whereClause,
// 		})
// 		const result = await prisma.da_received_inventory_inbox.findMany({
// 			orderBy: {
// 				updatedAt: 'desc',
// 			},
// 			where: whereClause,
// 			...(page && { skip: startIndex }),
// 			...(take && { take: take }),
// 			select: {
// 				id: true,
// 				procurement_no: true,
// 				procurement: {
// 					select: {
// 						procurement_no: true,
// 						// category: {
// 						// 	select: {
// 						// 		name: true,
// 						// 	},
// 						// },
// 						// subcategory: {
// 						// 	select: {
// 						// 		name: true,
// 						// 	},
// 						// },
// 						// brand: {
// 						// 	select: {
// 						// 		name: true,
// 						// 	},
// 						// },
// 						// unit: {
// 						// 	select: {
// 						// 		name: true,
// 						// 	},
// 						// },
// 						post_procurement: {
// 							select: {
// 								procurement_no: true,
// 								supplier_name: true,
// 								gst_no: true,
// 								final_rate: true,
// 								gst: true,
// 								total_quantity: true,
// 								total_price: true,
// 								unit_price: true,
// 								is_gst_added: true,
// 							},
// 						},
// 						// description: true,
// 						// quantity: true,
// 						// rate: true,
// 						total_rate: true,
// 						isEdited: true,
// 						remark: true,
// 						// status: {
// 						// 	select: {
// 						// 		status: true,
// 						// 	},
// 						// },
// 					},
// 				},
// 			},
// 		})

// 		let resultToSend: any[] = []
// 		await Promise.all(
// 			result.map(async (item: any) => {
// 				const temp = { ...item?.procurement }
// 				delete item.procurement

// 				const receivings = await prisma.receivings.findMany({
// 					where: {
// 						procurement_no: item?.procurement_no,
// 					},
// 					select: {
// 						procurement_no: true,
// 						receiving_no: true,
// 						date: true,
// 						received_quantity: true,
// 						remaining_quantity: true,
// 						is_added: true,
// 						remark: true,
// 						receiving_image: {
// 							select: {
// 								ReferenceNo: true,
// 								uniqueId: true,
// 								receiving_no: true,
// 							},
// 						},
// 					},
// 				})

// 				await Promise.all(
// 					receivings.map(async (receiving: any) => {
// 						await Promise.all(
// 							receiving?.receiving_image.map(async (img: any) => {
// 								const headers = {
// 									token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
// 								}
// 								await axios
// 									.post(process.env.DMS_GET || '', { referenceNo: img?.ReferenceNo }, { headers })
// 									.then(response => {
// 										// console.log(response?.data?.data, 'res')
// 										img.imageUrl = response?.data?.data?.fullPath
// 									})
// 									.catch(err => {
// 										// console.log(err?.data?.data, 'err')
// 										// toReturn.push(err?.data?.data)
// 										throw err
// 									})
// 							})
// 						)
// 					})
// 				)

// 				resultToSend.push({ ...item, ...temp, receivings: receivings })
// 			})
// 		)

// 		totalPage = Math.ceil(count / take)
// 		if (endIndex < count) {
// 			pagination.next = {
// 				page: page + 1,
// 				take: take,
// 			}
// 		}
// 		if (startIndex > 0) {
// 			pagination.prev = {
// 				page: page - 1,
// 				take: take,
// 			}
// 		}
// 		pagination.currentPage = page
// 		pagination.currentTake = take
// 		pagination.totalPage = totalPage
// 		pagination.totalResult = count
// 		return {
// 			data: resultToSend,
// 			pagination: pagination,
// 		}
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }
export const getReceivedInventoryDal = async (req: Request) => {
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
				procurement_stocks: {
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
						category_masterId: {
							in: category,
						},
					},
				]
				: []),
			...(subcategory[0]
				? [
					{
						procurement_stocks: {
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
						procurement_stocks: {
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
						status: {
							in: status.map(Number),
						},
					},
				]
				: []),
		]
	}

	try {
		count = await prisma.da_received_inventory_inbox.count({
			where: whereClause,
		})
		const result = await prisma.da_received_inventory_inbox.findMany({
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
						// procurement_stocks: true,
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

export const getReceivedInventoryByIdDal = async (req: Request) => {
	const { id } = req.params
	let resultToSend: any = {}
	try {
		const result: any = await prisma.da_received_inventory_inbox.findFirst({
			where: {
				id: id,
			},
			select: {
				id: true,
				procurement_no: true,
				procurement: {
					select: {
						procurement_no: true,
						// category: {
						// 	select: {
						// 		id: true,
						// 		name: true,
						// 	},
						// },
						// subcategory: {
						// 	select: {
						// 		id: true,
						// 		name: true,
						// 	},
						// },
						// brand: {
						// 	select: {
						// 		id: true,
						// 		name: true,
						// 	},
						// },
						post_procurement: {
							select: {
								procurement_no: true,
								supplier_name: true,
								gst_no: true,
								final_rate: true,
								gst: true,
								total_quantity: true,
								total_price: true,
								unit_price: true,
								is_gst_added: true,
							},
						},
						// description: true,
						// quantity: true,
						// rate: true,
						total_rate: true,
						isEdited: true,
						remark: true,
						// status: {
						// 	select: {
						// 		status: true,
						// 	},
						// },
					},
				},
			},
		})
		const totalReceiving: any = await prisma.receivings.aggregate({
			where: {
				procurement_no: result?.procurement_no || '',
			},
			_sum: {
				received_quantity: true,
			},
		})

		const receivings = await prisma.receivings.findMany({
			where: {
				procurement_no: result?.procurement_no || '',
			},
			select: {
				procurement_no: true,
				receiving_no: true,
				date: true,
				received_quantity: true,
				remaining_quantity: true,
				is_added: true,
				remark: true,
				receiving_image: {
					select: {
						ReferenceNo: true,
						uniqueId: true,
						receiving_no: true,
					},
				},
			},
		})

		await Promise.all(
			receivings.map(async (receiving: any) => {
				await Promise.all(
					receiving?.receiving_image.map(async (img: any) => {
						const headers = {
							token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
						}
						await axios
							.post(process.env.DMS_GET || '', { referenceNo: img?.ReferenceNo }, { headers })
							.then(response => {
								// console.log(response?.data?.data, 'res')
								img.imageUrl = response?.data?.data?.fullPath
							})
							.catch(err => {
								// console.log(err?.data?.data, 'err')
								// toReturn.push(err?.data?.data)
								throw err
							})
					})
				)
			})
		)

		const temp = { ...result?.procurement }
		delete result.procurement

		const deadStockCount = await prisma.dead_stock.count({
			where: { procurement_no: temp?.procurement_no },
		})

		resultToSend = {
			...result,
			...temp,
			receivings: receivings,
			total_receivings: totalReceiving?._sum?.received_quantity || 0,
			total_remaining: temp?.post_procurement?.total_quantity - totalReceiving?._sum?.received_quantity,
			dead_stock: deadStockCount,
		}

		return resultToSend
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getReceivedInventoryByOrderNoDal = async (req: Request) => {
	const { procurement_no } = req.params
	let resultToSend: any = {}
	try {
		const result: any = await prisma.da_received_inventory_inbox.findFirst({
			where: {
				procurement_no: procurement_no,
			},
			select: {
				id: true,
				procurement_no: true,
				procurement: {
					select: {
						procurement_no: true,
						// category: {
						// 	select: {
						// 		name: true,
						// 	},
						// },
						// subcategory: {
						// 	select: {
						// 		name: true,
						// 	},
						// },
						// brand: {
						// 	select: {
						// 		name: true,
						// 	},
						// },
						// unit: {
						// 	select: {
						// 		name: true,
						// 	},
						// },
						post_procurement: {
							select: {
								procurement_no: true,
								supplier_name: true,
								gst_no: true,
								final_rate: true,
								gst: true,
								total_quantity: true,
								total_price: true,
								unit_price: true,
								is_gst_added: true,
							},
						},
						// description: true,
						// quantity: true,
						// rate: true,
						total_rate: true,
						isEdited: true,
						remark: true,
						// status: {
						// 	select: {
						// 		status: true,
						// 	},
						// },
					},
				},
			},
		})

		if (!result) {
			throw { error: true, message: 'Received Inventory with provided Order Number not found' }
		}

		const totalReceiving: any = await prisma.receivings.aggregate({
			where: {
				procurement_no: result?.procurement_no || '',
			},
			_sum: {
				received_quantity: true,
			},
		})

		const receivings = await prisma.receivings.findMany({
			where: {
				procurement_no: result?.procurement_no || '',
			},
			select: {
				procurement_no: true,
				receiving_no: true,
				date: true,
				received_quantity: true,
				remaining_quantity: true,
				is_added: true,
				remark: true,
				receiving_image: {
					select: {
						ReferenceNo: true,
						uniqueId: true,
						receiving_no: true,
					},
				},
			},
		})

		await Promise.all(
			receivings.map(async (receiving: any) => {
				await Promise.all(
					receiving?.receiving_image.map(async (img: any) => {
						const headers = {
							token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
						}
						await axios
							.post(process.env.DMS_GET || '', { referenceNo: img?.ReferenceNo }, { headers })
							.then(response => {
								// console.log(response?.data?.data, 'res')
								img.imageUrl = response?.data?.data?.fullPath
							})
							.catch(err => {
								// console.log(err?.data?.data, 'err')
								// toReturn.push(err?.data?.data)
								throw err
							})
					})
				)
			})
		)

		const temp = { ...result?.procurement }
		delete result.procurement

		resultToSend = { ...result, ...temp, receivings: receivings, total_receivings: totalReceiving?._sum?.received_quantity }

		return resultToSend
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const createReceivingDal = async (req: Request) => {
	const { procurement_no, procurement_stock_id, date, received_quantity, remaining_quantity, remark, auth } = req.body
	const formattedDate = new Date(date)
	const ulb_id = JSON.parse(auth)?.ulb_id
	const img = req.files
	// console.log(img)
	try {
		const receiving_no = generateReceivingNumber(ulb_id)

		const procStock: any = await prisma.procurement_stocks.findFirst({
			where: {
				procurement_no: procurement_no,
				id: procurement_stock_id,
			},
		})

		if (!procStock) {
			throw { error: true, message: `No received inventory with order number ${procurement_no} ` }
		}

		const totalReceiving: any = await prisma.receivings.aggregate({
			where: {
				procurement_no: procurement_no,
				procurement_stock_id: procurement_stock_id,
			},
			_sum: {
				received_quantity: true,
			},
		})

		//check for received quantity exceeding total allowed quantity
		if (totalReceiving?._sum?.received_quantity + Number(received_quantity) > procStock?.quantity) {
			throw { error: true, message: 'Provided received quantity will make the total received quantity more than the quantity that can be received' }
		}

		// check for valid remaining quantity
		if ((totalReceiving?._sum?.received_quantity || 0) + Number(received_quantity) + Number(remaining_quantity) !== procStock?.quantity) {
			throw { error: true, message: 'Provided remaining quantity is invalid' }
		}

		await prisma.$transaction(async tx => {
			const createdReceiving = await tx.receivings.create({
				data: {
					procurement_no: procurement_no,
					procurement_stock_id: procurement_stock_id,
					receiving_no: receiving_no,
					date: formattedDate,
					remark: remark || null,
					received_quantity: Number(received_quantity),
					remaining_quantity: Number(remaining_quantity),
				},
			})

			if (!createdReceiving) {
				throw 'Error while receiving'
			}

			if (img) {
				const uploaded = await imageUploader(img) //It will return reference number and unique id as an object after uploading.

				await Promise.all(
					uploaded.map(async item => {
						await tx.receiving_image.create({
							data: {
								receiving_no: receiving_no,
								ReferenceNo: item?.ReferenceNo,
								uniqueId: item?.uniqueId,
							},
						})
					})
				)
			}

			const outboxCount = await prisma.da_received_inventory_outbox.count({
				where: {
					procurement_no: procurement_no,
				},
			})

			const srInboxCount = await prisma.sr_received_inventory_inbox.count({
				where: {
					procurement_no: procurement_no,
				},
			})

			if (srInboxCount === 0) {
				await tx.sr_received_inventory_inbox.create({
					data: { procurement_no: procurement_no },
				})
			}

			//check for fully received
			// const dataTocreate = { ...procStock }
			// delete dataTocreate.id
			// delete dataTocreate.createdAt
			// delete dataTocreate.updatedAt
			if (totalReceiving?._sum?.received_quantity + Number(received_quantity) === procStock?.quantity) {
				if (outboxCount === 0) {
					tx.da_received_inventory_outbox.create({
						data: { procurement_no: procurement_no },
					})
				}

				// await tx.da_received_inventory_inbox.delete({
				// 	where: {
				// 		procurement_no: procurement_no,
				// 	},
				// })
				await tx.procurement_stocks.update({
					where: {
						id: procurement_stock_id,
					},
					data: {
						is_partial: false,
					},
				})
			} else {
				if (outboxCount === 0) {
					await tx.da_received_inventory_outbox.create({
						data: { procurement_no: procurement_no },
					})
				}
			}

			const partialityCheck = await tx.procurement.count({
				where: {
					procurement_stocks: {
						some: {
							procurement_no: procurement_no,
							is_partial: true,
						},
					},
				},
			})

			if (partialityCheck === 0) {
				await tx.procurement.update({
					where: {
						procurement_no: procurement_no,
					},
					data: {
						is_partial: false,
						status: 5,
					},
				})
				await tx.da_received_inventory_inbox.delete({
					where: {
						procurement_no: procurement_no,
					},
				})
			} else {
				await tx.procurement.update({
					where: {
						procurement_no: procurement_no,
					},
					data: {
						status: 4,
					},
				})
			}
		})

		return 'Received'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

// export const createReceivingDal = async (req: Request) => {
// 	const { procurement_no, date, received_quantity, remaining_quantity, ulb_id, remark } = req.body
// 	const formattedDate = new Date(date)
// 	const img = req.files
// 	// console.log(img)
// 	try {
// 		const receiving_no = generateReceivingNumber(ulb_id)

// 		const data: any = {
// 			procurement_no: procurement_no,
// 			receiving_no: receiving_no,
// 			date: formattedDate,
// 			remark: remark,
// 			received_quantity: Number(received_quantity),
// 			remaining_quantity: Number(remaining_quantity),
// 		}

// 		const postProc: any = await prisma.post_procurement.findFirst({
// 			where: {
// 				procurement_no: procurement_no,
// 			},
// 		})

// 		if (!postProc) {
// 			throw { error: true, message: `No received inventory with order number ${procurement_no} ` }
// 		}

// 		const totalReceiving: any = await prisma.receivings.aggregate({
// 			where: {
// 				procurement_no: procurement_no,
// 			},
// 			_sum: {
// 				received_quantity: true,
// 			},
// 		})

// 		//check for received quantity exceeding total allowed quantity
// 		if (totalReceiving?._sum?.received_quantity + Number(received_quantity) > postProc?.total_quantity) {
// 			throw { error: true, message: 'Provided received quantity will make the total received quantity more than the quantity that can be received' }
// 		}

// 		// check for valid remaining quantity
// 		if (totalReceiving?._sum?.received_quantity + Number(received_quantity) + Number(remaining_quantity) !== postProc?.total_quantity) {
// 			throw { error: true, message: 'Provided remaining quantity is invalid' }
// 		}

// 		const createdReceiving = await prisma.receivings.create({
// 			data: data,
// 		})

// 		if (!createdReceiving) {
// 			throw 'Error while receiving'
// 		}

// 		if (img) {
// 			const uploaded = await imageUploader(img) //It will return reference number and unique id as an object after uploading.

// 			await Promise.all(
// 				uploaded.map(async item => {
// 					await prisma.receiving_image.create({
// 						data: {
// 							receiving_no: receiving_no,
// 							ReferenceNo: item?.ReferenceNo,
// 							uniqueId: item?.uniqueId,
// 						},
// 					})
// 				})
// 			)
// 		}

// 		const outboxCount = await prisma.da_received_inventory_outbox.count({
// 			where: {
// 				procurement_no: procurement_no,
// 			},
// 		})

// 		//check for fully received
// 		const dataTocreate = { ...postProc }
// 		delete dataTocreate.id
// 		delete dataTocreate.createdAt
// 		delete dataTocreate.updatedAt
// 		if (totalReceiving?._sum?.received_quantity + Number(received_quantity) === postProc?.total_quantity) {
// 			await prisma.$transaction([
// 				...(outboxCount === 0
// 					? [
// 						prisma.da_received_inventory_outbox.create({
// 							data: { procurement_no: procurement_no },
// 						}),
// 					]
// 					: []),
// 				prisma.da_received_inventory_inbox.delete({
// 					where: {
// 						procurement_no: procurement_no,
// 					},
// 				}),
// 				prisma.procurement_status.update({
// 					data: {
// 						status: 5,
// 					},
// 					where: {
// 						procurement_no: procurement_no,
// 					},
// 				}),
// 				prisma.procurement.update({
// 					where: {
// 						procurement_no: procurement_no,
// 					},
// 					data: {
// 						is_partial: false,
// 					},
// 				}),
// 				prisma.notification.create({
// 					data: {
// 						role_id: Number(process.env.ROLE_SR),
// 						title: 'Stock received',
// 						destination: 12,
// 						description: `Stock having procurement number : ${procurement_no} has been received completely`,
// 					},
// 				}),
// 			])
// 		} else {
// 			await prisma.$transaction([
// 				...(outboxCount === 0
// 					? [
// 						prisma.da_received_inventory_outbox.create({
// 							data: { procurement_no: procurement_no },
// 						}),
// 					]
// 					: []),
// 				prisma.procurement_status.update({
// 					data: {
// 						status: 4,
// 					},
// 					where: {
// 						procurement_no: procurement_no,
// 					},
// 				}),
// 				prisma.notification.create({
// 					data: {
// 						role_id: Number(process.env.ROLE_SR),
// 						title: 'Stock received',
// 						destination: 12,
// 						description: `Stock having procurement number : ${procurement_no} has been received partially`,
// 					},
// 				}),
// 			])
// 		}

// 		return 'Received'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

// export const getReceivedInventoryOutboxDal = async (req: Request) => {
// 	const page: number | undefined = Number(req?.query?.page)
// 	const take: number | undefined = Number(req?.query?.take)
// 	const startIndex: number | undefined = (page - 1) * take
// 	const endIndex: number | undefined = startIndex + take
// 	let count: number
// 	let totalPage: number
// 	let pagination: pagination = {}
// 	const whereClause: any = {}

// 	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

// 	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
// 	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
// 	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
// 	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

// 	//creating search options for the query
// 	if (search) {
// 		whereClause.OR = [
// 			{
// 				procurement_no: {
// 					contains: search,
// 					mode: 'insensitive',
// 				},
// 			},
// 			{
// 				procurement: {
// 					description: {
// 						contains: search,
// 						mode: 'insensitive',
// 					},
// 				},
// 			},
// 		]
// 	}

// 	//creating filter options for the query
// 	if (category[0]) {
// 		whereClause.procurement = {
// 			category_masterId: {
// 				in: category,
// 			},
// 		}
// 	}
// 	if (subcategory[0]) {
// 		whereClause.procurement = {
// 			subcategory_masterId: {
// 				in: subcategory,
// 			},
// 		}
// 	}
// 	if (status[0]) {
// 		whereClause.procurement = {
// 			status: {
// 				in: status.map(Number),
// 			},
// 		}
// 	}
// 	if (brand[0]) {
// 		whereClause.procurement = {
// 			brand_masterId: {
// 				in: brand,
// 			},
// 		}
// 	}

// 	try {
// 		count = await prisma.da_received_inventory_outbox.count({
// 			where: whereClause,
// 		})
// 		const result = await prisma.da_received_inventory_outbox.findMany({
// 			orderBy: {
// 				updatedAt: 'desc',
// 			},
// 			where: whereClause,
// 			...(page && { skip: startIndex }),
// 			...(take && { take: take }),
// 			select: {
// 				id: true,
// 				procurement_no: true,
// 				procurement: {
// 					select: {
// 						procurement_no: true,
// 						// category: {
// 						// 	select: {
// 						// 		name: true,
// 						// 	},
// 						// },
// 						// subcategory: {
// 						// 	select: {
// 						// 		name: true,
// 						// 	},
// 						// },
// 						// brand: {
// 						// 	select: {
// 						// 		name: true,
// 						// 	},
// 						// },
// 						// unit: {
// 						// 	select: {
// 						// 		name: true,
// 						// 	},
// 						// },
// 						post_procurement: {
// 							select: {
// 								procurement_no: true,
// 								supplier_name: true,
// 								gst_no: true,
// 								final_rate: true,
// 								gst: true,
// 								total_quantity: true,
// 								total_price: true,
// 								unit_price: true,
// 								is_gst_added: true,
// 							},
// 						},
// 						// description: true,
// 						// quantity: true,
// 						// rate: true,
// 						total_rate: true,
// 						isEdited: true,
// 						remark: true,
// 						// status: {
// 						// 	select: {
// 						// 		status: true,
// 						// 	},
// 						// },
// 					},
// 				},
// 			},
// 		})

// 		let resultToSend: any[] = []
// 		await Promise.all(
// 			result.map(async (item: any) => {
// 				const temp = { ...item?.procurement }
// 				delete item.procurement

// 				const receivings = await prisma.receivings.findMany({
// 					where: {
// 						procurement_no: item?.procurement_no,
// 					},
// 					select: {
// 						procurement_no: true,
// 						receiving_no: true,
// 						date: true,
// 						received_quantity: true,
// 						remaining_quantity: true,
// 						is_added: true,
// 						remark: true,
// 						receiving_image: {
// 							select: {
// 								ReferenceNo: true,
// 								uniqueId: true,
// 								receiving_no: true,
// 							},
// 						},
// 					},
// 				})

// 				await Promise.all(
// 					receivings.map(async (receiving: any) => {
// 						await Promise.all(
// 							receiving?.receiving_image.map(async (img: any) => {
// 								const headers = {
// 									token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
// 								}
// 								await axios
// 									.post(process.env.DMS_GET || '', { referenceNo: img?.ReferenceNo }, { headers })
// 									.then(response => {
// 										// console.log(response?.data?.data, 'res')
// 										img.imageUrl = response?.data?.data?.fullPath
// 									})
// 									.catch(err => {
// 										// console.log(err?.data?.data, 'err')
// 										// toReturn.push(err?.data?.data)
// 										throw err
// 									})
// 							})
// 						)
// 					})
// 				)

// 				resultToSend.push({ ...item, ...temp, receivings: receivings })
// 			})
// 		)

// 		totalPage = Math.ceil(count / take)
// 		if (endIndex < count) {
// 			pagination.next = {
// 				page: page + 1,
// 				take: take,
// 			}
// 		}
// 		if (startIndex > 0) {
// 			pagination.prev = {
// 				page: page - 1,
// 				take: take,
// 			}
// 		}
// 		pagination.currentPage = page
// 		pagination.currentTake = take
// 		pagination.totalPage = totalPage
// 		pagination.totalResult = count
// 		return {
// 			data: resultToSend,
// 			pagination: pagination,
// 		}
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }
export const getReceivedInventoryOutboxDal = async (req: Request) => {
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
				procurement_stocks: {
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
						category_masterId: {
							in: category,
						},
					},
				]
				: []),
			...(subcategory[0]
				? [
					{
						procurement_stocks: {
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
						procurement_stocks: {
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
						status: {
							in: status.map(Number),
						},
					},
				]
				: []),
		]
	}

	try {
		count = await prisma.da_received_inventory_outbox.count({
			where: whereClause,
		})
		const result = await prisma.da_received_inventory_outbox.findMany({
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
						// procurement_stocks: true,
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

export const getReceivedInventoryOutboxByIdDal = async (req: Request) => {
	const { id } = req.params
	let resultToSend: any = {}
	try {
		const result: any = await prisma.da_received_inventory_outbox.findFirst({
			where: {
				id: id,
			},
			select: {
				id: true,
				procurement_no: true,
				procurement: {
					select: {
						procurement_no: true,
						// category: {
						// 	select: {
						// 		id: true,
						// 		name: true,
						// 	},
						// },
						// subcategory: {
						// 	select: {
						// 		id: true,
						// 		name: true,
						// 	},
						// },
						// brand: {
						// 	select: {
						// 		id: true,
						// 		name: true,
						// 	},
						// },
						post_procurement: {
							select: {
								procurement_no: true,
								supplier_name: true,
								gst_no: true,
								final_rate: true,
								gst: true,
								total_quantity: true,
								total_price: true,
								unit_price: true,
								is_gst_added: true,
							},
						},
						// description: true,
						// quantity: true,
						// rate: true,
						total_rate: true,
						isEdited: true,
						remark: true,
						// status: {
						// 	select: {
						// 		status: true,
						// 	},
						// },
					},
				},
			},
		})
		const totalReceiving: any = await prisma.receivings.aggregate({
			where: {
				procurement_no: result?.procurement_no || '',
			},
			_sum: {
				received_quantity: true,
			},
		})

		const receivings = await prisma.receivings.findMany({
			where: {
				procurement_no: result?.procurement_no || '',
			},
			select: {
				procurement_no: true,
				receiving_no: true,
				date: true,
				received_quantity: true,
				remaining_quantity: true,
				is_added: true,
				remark: true,
				receiving_image: {
					select: {
						ReferenceNo: true,
						uniqueId: true,
						receiving_no: true,
					},
				},
			},
		})

		await Promise.all(
			receivings.map(async (receiving: any) => {
				await Promise.all(
					receiving?.receiving_image.map(async (img: any) => {
						const headers = {
							token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
						}
						await axios
							.post(process.env.DMS_GET || '', { referenceNo: img?.ReferenceNo }, { headers })
							.then(response => {
								// console.log(response?.data?.data, 'res')
								img.imageUrl = response?.data?.data?.fullPath
							})
							.catch(err => {
								// console.log(err?.data?.data, 'err')
								// toReturn.push(err?.data?.data)
								throw err
							})
					})
				)
			})
		)

		const temp = { ...result?.procurement }
		delete result.procurement

		const deadStockCount = await prisma.dead_stock.count({
			where: { procurement_no: temp?.procurement_no },
		})

		resultToSend = {
			...result,
			...temp,
			receivings: receivings,
			total_receivings: totalReceiving?._sum?.received_quantity || 0,
			total_remaining: temp?.post_procurement?.total_quantity - totalReceiving?._sum?.received_quantity,
			dead_stock: deadStockCount,
		}

		return resultToSend
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

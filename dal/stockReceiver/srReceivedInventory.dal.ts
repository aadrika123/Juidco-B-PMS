import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import { imageUploader } from '../../lib/imageUploader'
import axios from 'axios'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()
const dmsUrlGet = process.env.DMS_GET || ''

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
// 		count = await prisma.sr_received_inventory_inbox.count({
// 			where: whereClause,
// 		})
// 		const result = await prisma.sr_received_inventory_inbox.findMany({
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
	const whereClause: Prisma.sr_received_inventory_inboxWhereInput = {}
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
					}
				},
			},
		]
	}

	// if (category[0] || subcategory[0] || brand[0]) {
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
							}
						}
					},
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
	// }

	try {
		count = await prisma.sr_received_inventory_inbox.count({
			where: whereClause,
		})
		const result = await prisma.sr_received_inventory_inbox.findMany({
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
		const result: any = await prisma.sr_received_inventory_inbox.findFirst({
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
		const result: any = await prisma.sr_received_inventory_inbox.findFirst({
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
// 		count = await prisma.sr_received_inventory_outbox.count({
// 			where: whereClause,
// 		})
// 		const result = await prisma.sr_received_inventory_outbox.findMany({
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
	const whereClause: Prisma.sr_received_inventory_outboxWhereInput = {}
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
					}
				},
			},
		]
	}

	// if (category[0] || subcategory[0] || brand[0]) {
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
							}
						}
					},
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
	// }

	try {
		count = await prisma.sr_received_inventory_outbox.count({
			where: whereClause,
		})
		const result = await prisma.sr_received_inventory_outbox.findMany({
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
		const result: any = await prisma.sr_received_inventory_outbox.findFirst({
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

const getRateContractSupplier = async (id: string) => {
	const result = await prisma.rate_contract_supplier.findFirst({
		where: {
			id: id
		},
		select: {
			supplier_masterId: true
		}
	})
	return result?.supplier_masterId
}

export const addToInventoryDal = async (req: Request) => {
	const { procurement_no, procurement_stock_id, dead_stock, inventory, warranty } = req.body
	const img = req.files
	const formattedAuth = typeof req?.body?.auth !== 'string' ? JSON.stringify(req?.body?.auth) : req.body?.auth
	const ulb_id = JSON.parse(formattedAuth)?.ulb_id
	let inventoryId = inventory
	let exist: boolean = false
	let currentInventoryId: string
	try {
		const totalNonAddedReceiving: any = await prisma.receivings.aggregate({
			where: {
				procurement_no: procurement_no || '',
				procurement_stock_id: procurement_stock_id,
				is_added: false,
			},
			_sum: {
				received_quantity: true,
			},
		})

		if (totalNonAddedReceiving?._sum?.received_quantity === null) {
			throw { error: true, message: 'No receiving to be added' }
		}

		const NonAddedReceiving: any = await prisma.receivings.findMany({
			where: {
				procurement_no: procurement_no || '',
				procurement_stock_id: procurement_stock_id,
				is_added: false,
			},
		})

		if (dead_stock && !img) {
			throw { error: true, message: 'If there is any dead stock, at least one image is mandatory.' }
		}

		const procData = await prisma.procurement.findFirst({
			where: { procurement_no: procurement_no }
		})

		// const subcategory = await prisma.subcategory_master.findFirst({
		// 	where: {
		// 		id: procData?.subcategory_masterId as string,
		// 	},
		// })

		const procStockData = await prisma.procurement_stocks.findFirst({
			where: { id: procurement_stock_id },
			select: {
				subCategory: {
					select: {
						id: true,
						name: true
					}
				},
				category_masterId: true,
				unit_masterId: true,
				description: true,
			}
		})

		const query = `
			SELECT SUM(quantity) as total_quantity
			FROM product.product_${procStockData?.subCategory?.name.toLowerCase().replace(/\s/g, '')}
			 WHERE procurement_no = '${procurement_no}' AND is_added = false AND procurement_stock_id = '${procurement_stock_id}'
		`

		// const query = `
		// 	SELECT SUM(quantity) as total_quantity
		// 	 WHERE procurement_no = '${procurement_no}' AND is_added = false AND procurement_stock_id = '${procurement_stock_id}'
		// `
		const totalQuantity: any[] = await prisma.$queryRawUnsafe(query)

		if (totalQuantity[0]?.total_quantity !== totalNonAddedReceiving?._sum?.received_quantity) {
			throw { error: true, message: 'Number of added products must be equal to received stocks' }
		}

		await prisma.$transaction(async tx => {
			await Promise.all(
				NonAddedReceiving.map(async (item: any) => {
					const updatedReceiving = await tx.receivings.update({
						where: {
							id: item?.id,
						},
						data: {
							is_added: true,
						},
					})
					if (!updatedReceiving) throw { error: true, message: 'Error while updating receiving' }
				})
			)

			//check for any dead stock
			if (dead_stock) {
				const prev_dead_stock = await prisma.dead_stock.findFirst({
					where: {
						procurement_no: procurement_no,
					},
				})

				if (prev_dead_stock) {
					const updatedDeadStock = await tx.dead_stock.update({
						where: {
							procurement_no: procurement_no,
						},
						data: {
							quantity: Number(prev_dead_stock?.quantity) + Number(dead_stock),
						},
					})
					if (!updatedDeadStock) throw { error: true, message: 'Error while updating dead stock' }
				} else {
					const createdDeadStock = await tx.dead_stock.create({
						data: {
							procurement_no: procurement_no,
							quantity: Number(dead_stock),
						},
					})
					if (!createdDeadStock) throw { error: true, message: 'Error while creating dead stock' }
				}

				if (img) {
					const uploaded = await imageUploader(img) //It will return reference number and unique id as an object after uploading.

					await Promise.all(
						uploaded.map(async item => {
							const dsImg = await tx.dead_stock_image.create({
								data: {
									procurement_no: procurement_no,
									ReferenceNo: item?.ReferenceNo,
									uniqueId: item?.uniqueId,
								},
							})
							if (!dsImg) throw { error: true, message: 'Error while creating dead stock image' }
						})
					)
				}
			}
			const historyExistence = await prisma.stock_addition_history.findFirst({
				where: {
					procurement_no: procurement_no,
					procurement_stock_id: procurement_stock_id
				},
			})

			const supplier = await prisma.supplier_master.findFirst({
				where: { procurement_no: procurement_no },
				select: { id: true }
			})

			if (historyExistence) {
				inventoryId = historyExistence?.inventoryId
				exist = true
			}

			if (inventoryId) {
				const updatedInv = await tx.inventory.update({
					where: {
						id: inventoryId,
					},
					data: {
						quantity: {
							increment: dead_stock ? totalNonAddedReceiving?._sum?.received_quantity - Number(dead_stock) : totalNonAddedReceiving?._sum?.received_quantity,
						},
						// ulb_id: ulb_id
					},
				})

				currentInventoryId = updatedInv?.id


				if (!exist) {
					const historyCreation = await tx.stock_addition_history.create({
						data: {
							inventory: { connect: { id: inventoryId } },
							procurement_no: procurement_no,
							procurement_stock_id: procurement_stock_id
						},
					})
					if (!historyCreation) throw { error: true, message: 'Error while creating history' }
				}
				if (!updatedInv) throw { error: true, message: 'Error while updating inventory' }
			} else {
				const createdInv = await tx.inventory.create({
					data: {
						category: { connect: { id: procData?.category_masterId } },
						subcategory: { connect: { id: procStockData?.subCategory?.id } },
						// brand: { connect: { id: procData?.brand_masterId } },
						supplier_master: { connect: { id: procData?.is_rate_contract ? await getRateContractSupplier(procData?.rate_contract_supplier as string) : supplier?.id } },
						// supplier_masterId: supplier?.id,
						unit: { connect: { id: procStockData?.unit_masterId } },
						description: procStockData?.description,
						quantity: dead_stock ? totalNonAddedReceiving?._sum?.received_quantity - Number(dead_stock) : totalNonAddedReceiving?._sum?.received_quantity,
						...(warranty && { warranty: Boolean(warranty) }),
						ulb_id: ulb_id
					},
				})

				currentInventoryId = createdInv?.id

				if (!createdInv) throw { error: true, message: 'Error while creating inventory' }
				const historyCreation = await tx.stock_addition_history.create({
					data: {
						inventory: { connect: { id: createdInv?.id } },
						procurement_no: procurement_no,
						procurement_stock_id: procurement_stock_id
					},
				})
				if (!historyCreation) throw { error: true, message: 'Error while creating history for new item' }
			}

			const outboxExistence = await prisma.sr_received_inventory_outbox.count({
				where: {
					procurement_no: procurement_no,
				},
			})
			if (outboxExistence === 0) {
				const srRecInvOut = await tx.sr_received_inventory_outbox.create({
					data: {
						procurement_no: procurement_no,
					},
				})
				if (!srRecInvOut) throw { error: true, message: 'Error while creating SR outbox' }
			}
			if (!procData?.is_partial) {
				const srRecInvInDel = await tx.sr_received_inventory_inbox.delete({
					where: {
						procurement_no: procurement_no,
					},
				})
				if (!srRecInvInDel) throw { error: true, message: 'Error while deleting SR inbox' }
			}

			await tx.$queryRawUnsafe(`
				UPDATE product.product_${procStockData?.subCategory?.name.toLowerCase().replace(/\s/g, '')}
				SET is_added = true, is_available = true, inventory_id = '${currentInventoryId}'
				WHERE procurement_no = '${procurement_no}' AND is_added = false AND is_available = false
			`)

			// await tx.notification.create({
			// 	data: {
			// 		role_id: Number(process.env.ROLE_DA),
			// 		title: 'Stock added to inventory',
			// 		destination: 23,
			// 		description: `Stock having procurement Number : ${procurement_no} has been added to inventory.`,
			// 	},
			// })
		})

		return {
			dead_stock: dead_stock || 0,
			total_Added_stock: dead_stock ? totalNonAddedReceiving?._sum?.received_quantity - Number(dead_stock) : totalNonAddedReceiving?._sum?.received_quantity,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

// export const addToInventoryDal = async (req: Request) => {
// 	const { procurement_no, dead_stock, inventory, warranty } = req.body
// 	const img = req.files
// 	let inventoryId = inventory
// 	let exist: boolean = false
// 	let currentInventoryId: string
// 	try {
// 		const totalNonAddedReceiving: any = await prisma.receivings.aggregate({
// 			where: {
// 				procurement_no: procurement_no || '',
// 				is_added: false,
// 			},
// 			_sum: {
// 				received_quantity: true,
// 			},
// 		})

// 		if (totalNonAddedReceiving?._sum?.received_quantity === null) {
// 			throw { error: true, message: 'No receiving to be added' }
// 		}

// 		const NonAddedReceiving: any = await prisma.receivings.findMany({
// 			where: {
// 				procurement_no: procurement_no || '',
// 				is_added: false,
// 			},
// 		})

// 		if (dead_stock && !img) {
// 			throw { error: true, message: 'If there is any dead stock, at least one image is mandatory.' }
// 		}

// 		const procData = await prisma.procurement.findFirst({
// 			where: { procurement_no: procurement_no },
// 		})

// 		// const subcategory = await prisma.subcategory_master.findFirst({
// 		// 	where: {
// 		// 		id: procData?.subcategory_masterId as string,
// 		// 	},
// 		// })

// 		// const query = `
// 		// 	SELECT SUM(quantity) as total_quantity
// 		// 	FROM product.product_${subcategory?.name.toLowerCase().replace(/\s/g, '')}
// 		// 	 WHERE procurement_no = '${procurement_no}' AND is_added = false
// 		// `

// 		const query = `
// 			SELECT SUM(quantity) as total_quantity
// 			 WHERE procurement_no = '${procurement_no}' AND is_added = false
// 		`
// 		const totalQuantity: any[] = await prisma.$queryRawUnsafe(query)

// 		if (totalQuantity[0]?.total_quantity !== totalNonAddedReceiving?._sum?.received_quantity) {
// 			throw { error: true, message: 'Number of added products must be equal to received stocks' }
// 		}

// 		await prisma.$transaction(async tx => {
// 			await Promise.all(
// 				NonAddedReceiving.map(async (item: any) => {
// 					const updatedReceiving = await tx.receivings.update({
// 						where: {
// 							id: item?.id,
// 						},
// 						data: {
// 							is_added: true,
// 						},
// 					})
// 					if (!updatedReceiving) throw { error: true, message: 'Error while updating receiving' }
// 				})
// 			)

// 			//check for any dead stock
// 			if (dead_stock) {
// 				const prev_dead_stock = await prisma.dead_stock.findFirst({
// 					where: {
// 						procurement_no: procurement_no,
// 					},
// 				})

// 				if (prev_dead_stock) {
// 					const updatedDeadStock = await tx.dead_stock.update({
// 						where: {
// 							procurement_no: procurement_no,
// 						},
// 						data: {
// 							quantity: Number(prev_dead_stock?.quantity) + Number(dead_stock),
// 						},
// 					})
// 					if (!updatedDeadStock) throw { error: true, message: 'Error while updating dead stock' }
// 				} else {
// 					const createdDeadStock = await tx.dead_stock.create({
// 						data: {
// 							procurement_no: procurement_no,
// 							quantity: Number(dead_stock),
// 						},
// 					})
// 					if (!createdDeadStock) throw { error: true, message: 'Error while creating dead stock' }
// 				}

// 				if (img) {
// 					const uploaded = await imageUploader(img) //It will return reference number and unique id as an object after uploading.

// 					await Promise.all(
// 						uploaded.map(async item => {
// 							const dsImg = await tx.dead_stock_image.create({
// 								data: {
// 									procurement_no: procurement_no,
// 									ReferenceNo: item?.ReferenceNo,
// 									uniqueId: item?.uniqueId,
// 								},
// 							})
// 							if (!dsImg) throw { error: true, message: 'Error while creating dead stock image' }
// 						})
// 					)
// 				}
// 			}
// 			const historyExistence = await prisma.stock_addition_history.findFirst({
// 				where: { procurement_no: procurement_no },
// 			})

// 			if (historyExistence) {
// 				inventoryId = historyExistence?.inventoryId
// 				exist = true
// 			}

// 			if (inventoryId) {
// 				const updatedInv = await tx.inventory.update({
// 					where: {
// 						id: inventoryId,
// 					},
// 					data: {
// 						quantity: {
// 							increment: dead_stock ? totalNonAddedReceiving?._sum?.received_quantity - Number(dead_stock) : totalNonAddedReceiving?._sum?.received_quantity,
// 						},
// 					},
// 				})

// 				currentInventoryId = updatedInv?.id

// 				if (!exist) {
// 					const historyCreation = await tx.stock_addition_history.create({
// 						data: {
// 							inventory: { connect: { id: inventoryId } },
// 							procurement_no: procurement_no,
// 						},
// 					})
// 					if (!historyCreation) throw { error: true, message: 'Error while creating history' }
// 				}
// 				if (!updatedInv) throw { error: true, message: 'Error while updating inventory' }
// 			} else {
// 				const createdInv = await tx.inventory.create({
// 					data: {
// 						category: { connect: { id: procData?.category_masterId } },
// 						// subcategory: { connect: { id: procData?.subcategory_masterId } },
// 						// brand: { connect: { id: procData?.brand_masterId } },
// 						// unit: { connect: { id: procData?.unit_masterId } },
// 						// description: procData?.description,
// 						quantity: dead_stock ? totalNonAddedReceiving?._sum?.received_quantity - Number(dead_stock) : totalNonAddedReceiving?._sum?.received_quantity,
// 						...(warranty && { warranty: Boolean(warranty) }),
// 					},
// 				})

// 				currentInventoryId = createdInv?.id

// 				if (!createdInv) throw { error: true, message: 'Error while creating inventory' }
// 				const historyCreation = await tx.stock_addition_history.create({
// 					data: {
// 						inventory: { connect: { id: createdInv?.id } },
// 						procurement_no: procurement_no,
// 					},
// 				})
// 				if (!historyCreation) throw { error: true, message: 'Error while creating history for new item' }
// 			}

// 			const outboxExistence = await prisma.sr_received_inventory_outbox.count({
// 				where: {
// 					procurement_no: procurement_no,
// 				},
// 			})
// 			if (outboxExistence === 0) {
// 				const srRecInvOut = await tx.sr_received_inventory_outbox.create({
// 					data: {
// 						procurement_no: procurement_no,
// 					},
// 				})
// 				if (!srRecInvOut) throw { error: true, message: 'Error while creating SR outbox' }
// 			}
// 			if (!procData?.is_partial) {
// 				const srRecInvInDel = await tx.sr_received_inventory_inbox.delete({
// 					where: {
// 						procurement_no: procurement_no,
// 					},
// 				})
// 				if (!srRecInvInDel) throw { error: true, message: 'Error while deleting SR inbox' }
// 			}

// 			// await tx.$queryRawUnsafe(`
// 			// 	UPDATE product.product_${subcategory?.name.toLowerCase().replace(/\s/g, '')}
// 			// 	SET is_added = true, is_available = true, inventory_id = '${currentInventoryId}'
// 			// 	WHERE procurement_no = '${procurement_no}' AND is_added = false AND is_available = false
// 			// `)

// 			await tx.notification.create({
// 				data: {
// 					role_id: Number(process.env.ROLE_DA),
// 					title: 'Stock added to inventory',
// 					destination: 23,
// 					description: `Stock having procurement Number : ${procurement_no} has been added to inventory.`,
// 				},
// 			})
// 		})

// 		return {
// 			dead_stock: dead_stock || 0,
// 			total_Added_stock: dead_stock ? totalNonAddedReceiving?._sum?.received_quantity - Number(dead_stock) : totalNonAddedReceiving?._sum?.received_quantity,
// 		}
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: err?.message }
// 	}
// }

export const addProductDal = async (req: Request) => {
	type productType = {
		quantity: number
		serial_no: string
	}
	const { product, procurement_no, procurement_stock_id, brand }: { product: productType[]; procurement_no: string; procurement_stock_id: string, brand: string } = req.body
	try {
		if (!procurement_no) {
			throw { error: true, meta: { message: "Procurement number is required as 'procurement_no'" } }
		}

		const procExist = await prisma.procurement.count({
			where: {
				procurement_no: procurement_no,
			},
		})

		if (procExist === 0) {
			throw { error: true, meta: { message: 'Procurement number is invalid' } }
		}

		const totalNonAddedReceiving: any = await prisma.receivings.aggregate({
			where: {
				procurement_no: procurement_no || '',
				is_added: false,
			},
			_sum: {
				received_quantity: true,
			},
		})

		if (totalNonAddedReceiving?._sum?.received_quantity === null) {
			throw { error: true, meta: { message: 'No receiving to be added' } }
		}

		// const procData = await prisma.procurement.findFirst({
		// 	where: {
		// 		procurement_no: procurement_no
		// 	},
		// 	select: {
		// 		procurement_stocks: {
		// 			select: {
		// 				Stock_request: {
		// 					select: {
		// 						inventory: {
		// 							select: {
		// 								subcategory_masterId: true,
		// 							},
		// 						},
		// 					},
		// 				},
		// 			},
		// 		},
		// 	},
		// })
		const procStockData = await prisma.procurement_stocks.findFirst({
			where: { id: procurement_stock_id },
			select: {
				subCategory: {
					select: {
						id: true,
						name: true
					}
				}
			}
		})

		const query = `
			SELECT SUM(quantity) as total_quantity
			FROM product.product_${procStockData?.subCategory?.name.toLowerCase().replace(/\s/g, '')}
			 WHERE procurement_no = '${procurement_no}' AND is_added = false AND procurement_stock_id = '${procurement_stock_id}';
		`
		const totalQuantity: any[] = await prisma.$queryRawUnsafe(query)

		const sumOfQuantity = product.reduce((total, product) => total + (Number(product?.quantity) ? Number(product?.quantity) : 1), 0)

		if (totalQuantity[0]?.total_quantity + Number(sumOfQuantity) > totalNonAddedReceiving?._sum?.received_quantity) {
			throw { error: true, meta: { message: 'Number of added products cannot be more than received stocks' } }
		}

		await prisma.$transaction(async tx => {
			await Promise.all(
				product.map(async item => {
					await tx.$queryRawUnsafe(`
					INSERT INTO product.product_${procStockData?.subCategory?.name.toLowerCase().replace(/\s/g, '')} (
					serial_no,
					quantity,
					opening_quantity,
					procurement_no,
					procurement_stock_id,
					brand
					) VALUES ('${item?.serial_no}',${item?.quantity ? item?.quantity : 1},${item?.quantity ? item?.quantity : 1},'${procurement_no}','${procurement_stock_id}','${brand}' )
					`)
				})
			)
		})

		return 'Products added'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.meta?.message }
	}
}

// export const addProductDal = async (req: Request) => {
// 	type productType = {
// 		quantity: number
// 		serial_no: string
// 	}
// 	const { product, procurement_no, brand }: { product: productType[]; procurement_no: string; brand: string } = req.body
// 	try {
// 		if (!procurement_no) {
// 			throw { error: true, meta: { message: "Procurement number is required as 'procurement_no'" } }
// 		}

// 		const procExist = await prisma.procurement.count({
// 			where: {
// 				procurement_no: procurement_no,
// 			},
// 		})

// 		if (procExist === 0) {
// 			throw { error: true, meta: { message: 'Procurement number is invalid' } }
// 		}

// 		const totalNonAddedReceiving: any = await prisma.receivings.aggregate({
// 			where: {
// 				procurement_no: procurement_no || '',
// 				is_added: false,
// 			},
// 			_sum: {
// 				received_quantity: true,
// 			},
// 		})

// 		if (totalNonAddedReceiving?._sum?.received_quantity === null) {
// 			throw { error: true, meta: { message: 'No receiving to be added' } }
// 		}

// 		const procData = await prisma.procurement.findFirst({
// 			where: { procurement_no: procurement_no },
// 			select: {
// 				procurement_stocks: {
// 					select: {
// 						Stock_request: {
// 							select: {
// 								inventory: {
// 									select: {
// 										subcategory_masterId: true,
// 									},
// 								},
// 							},
// 						},
// 					},
// 				},
// 			},
// 		})

// 		const subcategory = await prisma.subcategory_master.findFirst({
// 			where: {
// 				id: procData?.procurement_stocks[0]?.Stock_request?.inventory?.subcategory_masterId as string,
// 			},
// 		})

// 		const query = `
// 			SELECT SUM(quantity) as total_quantity
// 			FROM product.product_${subcategory?.name.toLowerCase().replace(/\s/g, '')}
// 			 WHERE procurement_no = '${procurement_no}' AND is_added = false
// 		`
// 		const totalQuantity: any[] = await prisma.$queryRawUnsafe(query)

// 		const sumOfQuantity = product.reduce((total, product) => total + (product?.quantity ? product?.quantity : 1), 0)

// 		if (totalQuantity[0]?.total_quantity + sumOfQuantity > totalNonAddedReceiving?._sum?.received_quantity) {
// 			throw { error: true, meta: { message: 'Number of added products cannot be more than received stocks' } }
// 		}

// 		await prisma.$transaction(async tx => {
// 			await Promise.all(
// 				product.map(async item => {
// 					await tx.$queryRawUnsafe(`
// 					INSERT INTO product.product_${subcategory?.name.toLowerCase().replace(/\s/g, '')} (
// 					serial_no,
// 					quantity,
// 					opening_quantity,
// 					procurement_no,
// 					brand
// 					) VALUES ('${item?.serial_no}',${item?.quantity ? item?.quantity : 1},${item?.quantity ? item?.quantity : 1},'${procurement_no}','${brand}' )
// 					`)
// 				})
// 			)
// 		})

// 		return 'Products added'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: err?.meta?.message }
// 	}
// }

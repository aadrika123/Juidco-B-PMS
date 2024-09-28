import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import generateOrderNumber from '../../lib/orderNumberGenerator'
import getErrorMessage from '../../lib/getErrorMessage'
import { imageUploader } from '../../lib/imageUploader'
import { pagination } from '../../type/common.type'
import isUUID from '../../lib/uuidChecker'
import { extractRoleName } from '../../lib/roleNameExtractor'
// import { getCategoryByName } from '../masterEntry/category.dal'
// import { createSubcategoryNoReqDal } from '../masterEntry/subcategory.dal'
// import { createBrandNoReqDal } from '../masterEntry/brand.dal'

const prisma = new PrismaClient()

export type procurementType = {
	subcategory: string
	brand: string
	unit: string
	rate: number
	quantity: number
	total_rate: number
	description: string
}

export const createPreProcurementDal = async (req: Request) => {
	const { category, procurement, auth, supplier, is_rate_contract = false }: { category: string; procurement: procurementType[]; supplier?: string, is_rate_contract?: boolean, auth: any } = req.body

	const ulb_id = auth?.ulb_id

	const procurement_no: string = generateOrderNumber(ulb_id)

	let result: any = {
		procurement_no: procurement_no,
	}

	try {

		if (!category) {
			throw { error: true, message: 'Category is mandatory' }
		}

		if (!procurement || procurement.length === 0) {
			throw { error: true, message: 'List of procurements are mandatory' }
		}

		const total_rate = procurement.reduce((total, item) => total + item?.total_rate, 0)

		await prisma.$transaction(async tx => {
			await tx.procurement.create({
				data: {
					procurement_no: procurement_no,
					category: { connect: { id: category } },
					total_rate: total_rate,
					is_rate_contract: is_rate_contract,
					...(is_rate_contract && { rate_contract_supplier: supplier })
				},
			})
			await Promise.all(
				procurement.map(async item => {
					let description = item?.description

					if (isUUID(description)) {
						const inventoryData = await prisma.inventory.findFirst({
							where: {
								id: description
							},
							select: {
								description: true
							}
						})
						description = inventoryData?.description as string
					}

					await tx.procurement_stocks.create({
						data: {
							procurement_no: procurement_no,
							// boq_procurement_no: procurement_no,
							category_masterId: category,
							subCategory_masterId: item?.subcategory,
							unit_masterId: item?.unit,
							rate: Number(item?.rate),
							quantity: Number(item?.quantity),
							total_rate: Number(item?.total_rate),
							description: description,
						},
					})
				})
			)
			await tx.ia_pre_procurement_inbox.create({
				data: {
					procurement_no: procurement_no,
				},
			})
		})
		return result
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: err?.message }
	}
}

// export const createPreProcurementDal = async (req: Request) => {
// 	// const { auth, stocks }: { auth: any; stocks: string[] } = req.body
// 	// const ulb_id = auth?.ulb_id
// 	// try {
// 	// 	stocks.map((stock: string) => {
// 	// 		if (!stock) {
// 	// 			throw { error: true, message: 'Minimum one stock data is required' }
// 	// 		}
// 	// 		// if (!stock.rate) {
// 	// 		// 	throw { error: true, message: 'Please mention rate for the given stock item' }
// 	// 		// }
// 	// 		// if (stock.quantity && stock.rate) {
// 	// 		// 	stock.totalRate = Number(stock.quantity) * Number(stock.rate)
// 	// 		// }
// 	// 	})

// 	// 	const categories = await Promise.all(
// 	// 		stocks.map(async (stock: string) => {
// 	// 			const stockItem = await prisma.stock_request.findFirst({
// 	// 				where: {
// 	// 					stock_handover_no: String(stock),
// 	// 				},
// 	// 				select: {
// 	// 					allotted_quantity: true,
// 	// 					inventory: {
// 	// 						select: {
// 	// 							category: true,
// 	// 						},
// 	// 					},
// 	// 				},
// 	// 			})

// 	// 			if (!stockItem) {
// 	// 				throw { error: true, message: 'Invalid Stock Id' }
// 	// 			}

// 	// 			return stockItem?.inventory?.category
// 	// 		})
// 	// 	)

// 	// 	console.log(categories, 'categories')

// 	// 	if (!categories) {
// 	// 		throw { error: true, message: 'No categories found for the stock request' }
// 	// 	}

// 	// 	const firtsCategory = categories[0]
// 	// 	const categoryValidation = categories.every(category => category === firtsCategory)

// 	// 	if (!categoryValidation) {
// 	// 		throw { error: true, message: 'Procurement is created for same category stock request' }
// 	// 	}

// 	// 	let procurement_no = generateOrderNumber(ulb_id)

// 	// 	// let total: number = 0
// 	// 	// stocks.map(obj => {
// 	// 	// 	total += Number(obj?.rate) * Number(obj?.quantity)
// 	// 	// })

// 	// 	// const procurement = await prisma.procurement.create({
// 	// 	// 	data: {
// 	// 	// 		procurement_no,
// 	// 	// 		status: 1,
// 	// 	// 		total_rate: total,
// 	// 	// 		procurement_stocks: {
// 	// 	// 			create: stocks.map(data => ({
// 	// 	// 				handover_no: data?.stockNo,
// 	// 	// 				procurement_no,
// 	// 	// 			})),
// 	// 	// 		},
// 	// 	// 	},
// 	// 	// })

// 	// 	// let iaProcInbox = {}
// 	// 	// if (procurement) {
// 	// 	// 	iaProcInbox = await prisma.ia_pre_procurement_inbox.create({
// 	// 	// 		data: {
// 	// 	// 			procurement_no,
// 	// 	// 		},
// 	// 	// 	})
// 	// 	// }

// 	// 	// return iaProcInbox
// 	// } catch (err: any) {
// 	// 	console.log(err?.message)
// 	// 	return { error: true, message: err?.message }
// 	// }
// 	// const ordersData = await prisma.stock_request
// 	const { category, subcategory, brand, description, rate, total_rate, quantity, ulb_id, unit } = req.body

// 	let procurement_no: string
// 	// let isOthers = false

// 	let processedCategory = category
// 	let processedSubcategory = subcategory
// 	let processedBrand = brand

// 	if (String(category).toLowerCase() === 'others') {
// 		// isOthers = true
// 		const fetchedCategory = (await getCategoryByName(category)) as category_master
// 		processedCategory = fetchedCategory?.id
// 		const createdSubcategory = (await createSubcategoryNoReqDal(subcategory, fetchedCategory?.id)) as subcategory_master
// 		processedSubcategory = createdSubcategory?.id
// 		if (brand) {
// 			const createdBrand = (await createBrandNoReqDal(brand, createdSubcategory?.id)) as brand_master
// 			processedBrand = createdBrand?.id
// 		}
// 	}

// 	procurement_no = generateOrderNumber(ulb_id)

// 	const data: any = {
// 		category: { connect: { id: processedCategory } },
// 		subCategory: { connect: { id: processedSubcategory } },
// 		...(brand && { brand: { connect: { id: brand } } }),
// 		// unit: { connect: { id: processedBrand } },
// 		...(unit && { unit: { connect: { id: unit } } }),
// 		description: description,
// 		procurement_no: procurement_no,
// 		rate: Number(rate),
// 		quantity: Number(quantity),
// 		total_rate: Number(total_rate),
// 		status: 0,
// 		// status: {
// 		// 	create: {
// 		// 		procurement_no: procurement_no,
// 		// 		status: 0,
// 		// 	},
// 		// },
// 	}
// 	try {
// 		if (Number(rate) && Number(quantity)) {
// 			if (Number(rate) * Number(quantity) !== Number(total_rate)) {
// 				throw { error: true, message: 'The calculation result for total rate is invalid' }
// 			}
// 		} else {
// 			throw { error: true, message: 'Rate and Quantity are mandatory' }
// 		}
// 		const result = await prisma.procurement.create({
// 			data: data,
// 		})
// 		let srPreIn = {}
// 		if (result) {
// 			srPreIn = await prisma.sr_pre_procurement_inbox.create({
// 				data: {
// 					procurement_no: procurement_no,
// 				},
// 			})
// 		}
// 		return result
// 	} catch (err: any) {
// 		console.log(err?.message)
// 		return { error: true, message: err?.message }
// 	}
// }

export const getPreProcurementDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.ia_pre_procurement_inboxWhereInput = {}

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
								}
							},
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
								}
							}
						},
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
		]
	}

	try {
		count = await prisma.ia_pre_procurement_inbox.count({
			where: whereClause,
		})
		const result = await prisma.ia_pre_procurement_inbox.findMany({
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

export const getPreProcurementByIdDal = async (req: Request) => {
	const { id } = req.params
	try {
		const result: any = await prisma.sr_pre_procurement_inbox.findFirst({
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

		let resultToSend: any = {}

		const temp = { ...result?.procurement }
		delete result.procurement
		resultToSend = { ...result, ...temp }

		return resultToSend
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getPreProcurementByOrderNoDal = async (req: Request) => {
	const { procurement_no } = req.params
	try {
		const result: any = await prisma.sr_pre_procurement_inbox.findFirst({
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
		let resultToSend: any = {}

		const temp = { ...result?.procurement }
		delete result.procurement
		resultToSend = { ...result, ...temp }

		return resultToSend
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const forwardToDaDal = async (req: Request) => {
	const { preProcurement }: { preProcurement: string } = req.body
	const img = req.files

	try {
		await Promise.all(
			JSON.parse(preProcurement).map(async (item: string) => {
				const status: any = await prisma.sr_pre_procurement_inbox.findFirst({
					where: {
						id: item,
					},
					select: {
						procurement: {
							select: {
								// status: {
								// 	select: { status: true },
								// },
							},
						},
					},
				})
				if (status?.procurement?.status?.status < -1 || status?.procurement?.status?.status > 0) {
					throw { error: true, message: 'Pre Procurement is not valid to be forwarded' }
				}
				const inbox: any = await prisma.sr_pre_procurement_inbox.findFirst({
					where: {
						id: item,
					},
					select: {
						procurement_no: true,
					},
				})
				const statusChecker = (status: number) => {
					if (status === 0) {
						return 1
					} else {
						return 69
					}
				}

				if (inbox === null) {
					throw { error: true, message: 'Invalid inbox ID' }
				}
				const daOutbox: any = await prisma.da_pre_procurement_outbox.count({
					where: {
						procurement_no: inbox?.procurement_no,
					},
				})

				if (img) {
					const uploaded = await imageUploader(img) //It will return reference number and unique id as an object after uploading.
					if (uploaded) {
						await Promise.all(
							uploaded.map(async item => {
								await prisma.note_sheet.create({
									data: {
										procurement_no: inbox?.procurement_no,
										ReferenceNo: item?.ReferenceNo,
										uniqueId: item?.uniqueId,
										operation: 1,
									},
								})
							})
						)
					}
				}

				const statusToUpdate = statusChecker(Number(status?.procurement?.status?.status))
				delete inbox.status
				await prisma.$transaction([
					prisma.sr_pre_procurement_outbox.create({
						data: inbox,
					}),
					prisma.da_pre_procurement_inbox.create({
						data: inbox,
					}),
					prisma.procurement_status.update({
						where: {
							procurement_no: inbox?.procurement_no,
						},
						data: {
							status: statusToUpdate,
						},
					}),
					prisma.sr_pre_procurement_inbox.delete({
						where: {
							id: item,
						},
					}),
					...(daOutbox !== 0
						? [
							prisma.da_pre_procurement_outbox.delete({
								where: {
									procurement_no: inbox?.procurement_no,
								},
							}),
						]
						: []),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DA),
							title: 'New procurement',
							destination: 20,
							from: await extractRoleName(Number(process.env.ROLE_IA)),
							description: `There is a new procurement to be approved. Procurement Number : ${inbox?.procurement_no}`,
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

export const forwardToLevel1Dal = async (req: Request) => {
	const { procurement_no }: { procurement_no: string } = req.body
	const img = req?.files

	try {
		const procData = await prisma.procurement.findFirst({
			where: {
				procurement_no: procurement_no,
			},
		})

		if (!procData) {
			throw { error: true, message: 'Invalid procurement' }
		}

		if (procData?.status !== 0 && procData?.status !== 11) {
			throw { error: true, message: 'Procurement is not valid to be forwarded' }
		}

		const statusChecker = (status: number) => {
			if (status === 0) {
				return 10
			} else {
				return 13
			}
		}

		const level1Outbox = await prisma.level1_outbox.count({
			where: {
				procurement_no: procurement_no,
			},
		})

		await prisma.$transaction(async tx => {
			if (img) {
				const uploaded = await imageUploader(img) //It will return reference number and unique id as an object after uploading.
				if (uploaded) {
					await Promise.all(
						uploaded.map(async item => {
							await tx.note_sheet.create({
								data: {
									procurement_no: procurement_no,
									ReferenceNo: item?.ReferenceNo,
									uniqueId: item?.uniqueId,
									operation: 1,
								},
							})
						})
					)
				}
			}

			const statusToUpdate = statusChecker(Number(procData?.status))

			await tx.ia_pre_procurement_outbox.create({
				data: { procurement_no: procurement_no },
			})

			await tx.level1_inbox.create({
				data: { procurement_no: procurement_no },
			})

			await tx.procurement.update({
				where: {
					procurement_no: procurement_no,
				},
				data: {
					status: statusToUpdate,
				},
			})

			await tx.ia_pre_procurement_inbox.delete({
				where: {
					procurement_no: procurement_no,
				},
			})

			if (level1Outbox) {
				await tx.level1_outbox.delete({
					where: {
						procurement_no: procurement_no,
					},
				})
			}

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_LEVEL1),
					title: 'New procurement',
					destination: 50,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: `There is a new procurement to be approved. Procurement Number : ${procurement_no}`,
				},
			})
		})
		return 'Forwarded'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

// export const getPreProcurementOutboxDal = async (req: Request) => {
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
// 	whereClause.NOT = [
// 		{
// 			procurement: {
// 				status: {
// 					status: -2,
// 				},
// 			},
// 		},
// 		{
// 			procurement: {
// 				status: {
// 					status: 2,
// 				},
// 			},
// 		},
// 	]

// 	try {
// 		count = await prisma.sr_pre_procurement_outbox.count({
// 			where: whereClause,
// 		})
// 		const result = await prisma.sr_pre_procurement_outbox.findMany({
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

// 		result.map(async (item: any) => {
// 			const temp = { ...item?.procurement }
// 			delete item.procurement
// 			resultToSend.push({ ...item, ...temp })
// 		})

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
export const getPreProcurementOutboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.ia_pre_procurement_outboxWhereInput = {}

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
								}
							},
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
								}
							}
						},
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
		]
	}

	try {
		count = await prisma.ia_pre_procurement_outbox.count({
			where: whereClause,
		})
		const result = await prisma.ia_pre_procurement_outbox.findMany({
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

export const getPreProcurementOutboxByIdDal = async (req: Request) => {
	const { id } = req.params
	try {
		const result: any = await prisma.sr_pre_procurement_outbox.findFirst({
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

		let resultToSend: any = {}

		const temp = { ...result?.procurement }
		delete result.procurement
		resultToSend = { ...result, ...temp }

		return resultToSend
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getPreProcurementRejectedDal = async (req: Request) => {
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
				procurement: {
					description: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	//creating filter options for the query
	if (category[0]) {
		whereClause.procurement = {
			category_masterId: {
				in: category,
			},
		}
	}
	if (subcategory[0]) {
		whereClause.procurement = {
			subcategory_masterId: {
				in: subcategory,
			},
		}
	}
	if (status[0]) {
		whereClause.procurement = {
			status: {
				in: status.map(Number),
			},
		}
	}
	if (brand[0]) {
		whereClause.procurement = {
			brand_masterId: {
				in: brand,
			},
		}
	}
	whereClause.procurement = {
		status: {
			status: -2,
		},
	}

	try {
		count = await prisma.sr_pre_procurement_inbox.count({
			where: whereClause,
		})
		const result = await prisma.sr_pre_procurement_inbox.findMany({
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

export const getPreProcurementReleasedDal = async (req: Request) => {
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
				procurement: {
					description: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	//creating filter options for the query
	if (category[0]) {
		whereClause.procurement = {
			category_masterId: {
				in: category,
			},
		}
	}
	if (subcategory[0]) {
		whereClause.procurement = {
			subcategory_masterId: {
				in: subcategory,
			},
		}
	}
	if (status[0]) {
		whereClause.procurement = {
			status: {
				in: status.map(Number),
			},
		}
	}
	if (brand[0]) {
		whereClause.procurement = {
			brand_masterId: {
				in: brand,
			},
		}
	}
	whereClause.procurement = {
		status: {
			status: 2,
		},
	}

	try {
		count = await prisma.sr_pre_procurement_inbox.count({
			where: whereClause,
		})
		const result = await prisma.sr_pre_procurement_inbox.findMany({
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

export const editPreProcurementDal = async (req: Request) => {
	const { procurement_no, category, subcategory, brand, description, rate, quantity, total_rate, remark, unit } = req.body

	const data = {
		category: { connect: { id: category } },
		subcategory: { connect: { id: subcategory } },
		brand: { connect: { id: brand } },
		...(unit && { unit: { connect: { id: unit } } }),
		description: description,
		rate: Number(rate),
		quantity: Number(quantity),
		total_rate: Number(total_rate),
		isEdited: true,
		remark: remark,
	}
	if (Number(rate) && Number(quantity)) {
		if (Number(rate) * Number(quantity) !== Number(total_rate)) {
			return { error: true, message: 'The calculation result for total rate is invalid' }
		}
	}

	const procurement: any = await prisma.procurement.findFirst({
		where: {
			procurement_no: procurement_no,
		},
		// include: {
		// 	status: true,
		// },
	})
	const tempStatus = Number(procurement?.status?.status)

	const tempData: any = {
		procurement_no: procurement_no,
		category: { connect: { id: procurement?.category_masterId } },
		subcategory: { connect: { id: procurement?.subcategory_masterId } },
		brand: { connect: { id: procurement?.brand_masterId } },
		...(unit && { unit: { connect: { id: unit } } }),
		description: procurement?.description,
		rate: procurement?.rate,
		quantity: procurement?.quantity,
		total_rate: procurement?.total_rate,
		remark: procurement?.remark,
		isEdited: procurement?.isEdited,
		status: tempStatus,
	}

	const historyExistence = await prisma.procurement_history.count({
		where: {
			procurement_no: procurement_no,
		},
	})

	try {
		await prisma.$transaction([
			...(historyExistence === 0
				? [
					prisma.procurement_history.create({
						data: tempData,
					}),
				]
				: []),
			prisma.procurement.update({
				where: {
					procurement_no: procurement_no,
				},
				data: data,
			}),
			// prisma.da_pre_procurement_outbox.update({
			//     where: {
			//         procurement_no: procurement_no
			//     },
			//     data:
			// }),
			// prisma.pre_procurement_history.update({
			//     where: {
			//         procurement_no: procurement_no
			//     },
			//     data: data
			// })
		])
		return 'Edited'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

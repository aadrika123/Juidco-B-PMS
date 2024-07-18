import { Request } from 'express'
import { PrismaClient, basic_details, bid_openers, cover_details, cover_details_docs, critical_dates, fee_details, work_details } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { imageUploader } from '../../lib/imageUploader'
import { pagination, uploadedDoc } from '../../type/common.type'
import { boqData } from '../../type/accountant.type'
import generateReferenceNumber from '../../lib/referenceNumberGenerator'
import axios from 'axios'

const prisma = new PrismaClient()

export const getPreProcurementForBoqDal = async (req: Request) => {
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
	// const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]

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

	if (category[0] || subcategory[0] || brand[0]) {
		whereClause.AND = [
			...(category[0]
				? [
						{
							procurement: {
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
							procurement: {
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
							procurement: {
								brand_masterId: {
									in: brand,
								},
							},
						},
					]
				: []),
		]
	}

	// //creating filter options for the query
	// if (category[0]) {
	//     whereClause.procurement = {
	//         category_masterId: {
	//             in: category
	//         }
	//     }
	// }
	// if (subcategory[0]) {
	//     whereClause.procurement = {
	//         subcategory_masterId: {
	//             in: subcategory
	//         }
	//     }
	// }
	// if (brand[0]) {
	//     whereClause.procurement = {
	//         brand_masterId: {
	//             in: brand
	//         }
	//     }
	// }
	// if (status[0]) {
	//     whereClause.procurement = {
	//         status: {
	//             status: {
	//                 in: status.map(Number)
	//             }
	//         }
	//     }
	// }
	whereClause.procurement = {
		status: {
			status: 1,
		},
	}

	try {
		count = await prisma.acc_pre_procurement_inbox.count({
			where: whereClause,
		})
		const result = await prisma.acc_pre_procurement_inbox.findMany({
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
						description: true,
						remark: true,
						quantity: true,
						rate: true,
						total_rate: true,
						isEdited: true,
						status: {
							select: {
								status: true,
							},
						},
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

export const getPreProcurementDal = async (req: Request) => {
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
				status: {
					in: status.map(Number),
				},
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
	// whereClause.NOT = [
	//     {
	//         procurement: {
	//             status: {
	//                 status: -70
	//             }
	//         }
	//     },
	//     {
	//         procurement: {
	//             status: {
	//                 status: 70
	//             }
	//         }
	//     },
	// ]

	try {
		count = await prisma.acc_pre_procurement_inbox.count({
			where: whereClause,
		})
		const result = await prisma.acc_pre_procurement_inbox.findMany({
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
						description: true,
						quantity: true,
						rate: true,
						total_rate: true,
						isEdited: true,
						remark: true,
						status: {
							select: {
								status: true,
							},
						},
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

export const getPreProcurementBulkByOrderNoDal = async (req: Request) => {
	const { procurement_no }: { procurement_no: string[] } = req.body
	let resultToSend: any = []
	try {
		await Promise.all(
			procurement_no.map(async (item: string) => {
				const result: any = await prisma.procurement.findFirst({
					where: {
						procurement_no: item,
					},
					select: {
						id: true,
						procurement_no: true,
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
						description: true,
						quantity: true,
						rate: true,
						total_rate: true,
						isEdited: true,
						remark: true,
						status: {
							select: {
								status: true,
							},
						},
					},
				})

				resultToSend.push(result)
			})
		)

		return resultToSend
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const createBoqDal = async (req: Request) => {
	const { boqData } = req.body
	try {
		const formattedBoqData: boqData = JSON.parse(boqData)
		const img = req.files as Express.Multer.File[]
		let arrayToSend: any[] = []
		let docToSend: any[] = []

		const reference_no: string = generateReferenceNumber(formattedBoqData?.ulb_id)

		await Promise.all(
			formattedBoqData?.procurement.map(async item => {
				const preparedData = {
					reference_no: reference_no,
					procurement_no: item?.procurement_no,
					description: item?.description,
					quantity: item?.quantity,
					unit: item?.unit,
					rate: item?.rate,
					amount: item?.amount,
					remark: item?.remark,
				}

				const status = await prisma.procurement_status.findFirst({
					where: {
						procurement_no: item?.procurement_no,
					},
					select: {
						status: true,
					},
				})

				if (status?.status !== 1) {
					throw {
						error: true,
						message: `Procurement : ${item?.procurement_no} is not valid for BOQ`,
					}
				}

				arrayToSend.push(preparedData)
			})
		)

		const preparedBoq = {
			reference_no: reference_no,
			gst: formattedBoqData?.gst,
			estimated_cost: formattedBoqData?.estimated_cost,
			remark: formattedBoqData?.remark,
			hsn_code: formattedBoqData?.hsn_code,
		}

		if (img) {
			const uploaded: uploadedDoc[] = await imageUploader(img) //It will return reference number and unique id as an object after uploading.

			uploaded.map((doc: uploadedDoc) => {
				const preparedBoqDoc = {
					reference_no: reference_no,
					ReferenceNo: doc?.ReferenceNo,
					uniqueId: doc?.uniqueId,
					remark: formattedBoqData?.remark,
				}
				docToSend.push(preparedBoqDoc)
			})
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.boq.create({
				data: preparedBoq,
			})

			await tx.boq_procurement.createMany({
				data: arrayToSend,
			})

			if (img) {
				await tx.boq_doc.createMany({
					data: docToSend,
				})
			}

			await Promise.all(
				formattedBoqData?.procurement.map(async item => {
					await tx.procurement_status.update({
						where: {
							procurement_no: item?.procurement_no,
						},
						data: {
							status: 70,
						},
					})
					// await tx.acc_pre_procurement_inbox.delete({
					// 	where: {
					// 		procurement_no: item?.procurement_no,
					// 	},
					// })
					// await tx.acc_pre_procurement_outbox.create({
					// 	data: {
					// 		procurement_no: item?.procurement_no,
					// 	},
					// })
					// await tx.da_pre_procurement_outbox.delete({
					// 	where: {
					// 		procurement_no: item?.procurement_no,
					// 	},
					// })
					// await tx.da_pre_procurement_inbox.create({
					// 	data: {
					// 		procurement_no: item?.procurement_no,
					// 	},
					// })
					await tx.notification.create({
						data: {
							role_id: Number(process.env.ROLE_SR),
							title: 'BOQ created',
							destination: 10,
							description: `BOQ created for procurement Number : ${item?.procurement_no}`,
						},
					})
				})
			)

			// await tx.acc_boq_outbox.create({
			// 	data: {
			// 		reference_no: reference_no,
			// 	},
			// })

			await tx.da_boq_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})
		})

		return reference_no
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getPreProcurementOutboxDal = async (req: Request) => {
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
				status: {
					in: status.map(Number),
				},
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
	// whereClause.NOT = [
	//     {
	//         procurement: {
	//             status: {
	//                 status: -70
	//             }
	//         }
	//     },
	//     {
	//         procurement: {
	//             status: {
	//                 status: 70
	//             }
	//         }
	//     },
	// ]

	try {
		count = await prisma.acc_pre_procurement_outbox.count({
			where: whereClause,
		})
		const result = await prisma.acc_pre_procurement_outbox.findMany({
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
						description: true,
						quantity: true,
						rate: true,
						total_rate: true,
						isEdited: true,
						remark: true,
						status: {
							select: {
								status: true,
							},
						},
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

export const getBoqInboxDal = async (req: Request) => {
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
				reference_no: {
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
	if (category[0] || subcategory[0] || brand[0]) {
		whereClause.AND = [
			...(category[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											category_masterId: {
												in: category,
											},
										},
									},
								},
							},
						},
					]
				: []),

			...(subcategory[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											subcategory_masterId: {
												in: subcategory,
											},
										},
									},
								},
							},
						},
					]
				: []),

			...(brand[0]
				? [
						{
							boq: {
								status: {
									in: status.map(Number),
								},
							},
						},
					]
				: []),

			...(brand[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											brand_masterId: {
												in: brand,
											},
										},
									},
								},
							},
						},
					]
				: []),
		]
	}
	// whereClause.NOT = [
	//     {
	//         procurement: {
	//             status: {
	//                 status: -2
	//             }
	//         }
	//     },
	//     {
	//         procurement: {
	//             status: {
	//                 status: 2
	//             }
	//         }
	//     },
	// ]

	try {
		count = await prisma.acc_boq_inbox.count({
			where: whereClause,
		})
		const result = await prisma.acc_boq_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				reference_no: true,
				boq: {
					select: {
						reference_no: true,
						gst: true,
						estimated_cost: true,
						remark: true,
						status: true,
						isEdited: true,
						hsn_code: true,
						procurements: {
							select: {
								procurement: {
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
									},
								},
							},
						},
						boq_doc: {
							select: {
								ReferenceNo: true,
							},
						},
					},
				},
			},
		})

		await Promise.all(
			result.map(async item => {
				await Promise.all(
					item?.boq?.boq_doc.map(async (doc: any) => {
						const headers = {
							token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
						}
						await axios
							.post(process.env.DMS_GET || '', { referenceNo: doc?.ReferenceNo }, { headers })
							.then(response => {
								// console.log(response?.data?.data, 'res')
								doc.imageUrl = response?.data?.data?.fullPath
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

		let dataToSend: any[] = []
		result.forEach((item: any) => {
			const updatedProcurements = item?.boq?.procurements.map((proc: any) => {
				const { procurement, ...rest } = proc
				return { ...rest, ...procurement }
			})

			// Assign the updated array back to item.boq.procurements
			item.boq.procurements = updatedProcurements

			//flatten the boq object
			const { boq, ...rest } = item
			dataToSend.push({ ...rest, ...boq })
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
			data: dataToSend,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getBoqOutboxDal = async (req: Request) => {
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
				reference_no: {
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
	//creating filter options for the query
	if (category[0] || subcategory[0] || brand[0]) {
		whereClause.AND = [
			...(category[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											category_masterId: {
												in: category,
											},
										},
									},
								},
							},
						},
					]
				: []),

			...(subcategory[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											subcategory_masterId: {
												in: subcategory,
											},
										},
									},
								},
							},
						},
					]
				: []),

			...(brand[0]
				? [
						{
							boq: {
								status: {
									in: status.map(Number),
								},
							},
						},
					]
				: []),

			...(brand[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											brand_masterId: {
												in: brand,
											},
										},
									},
								},
							},
						},
					]
				: []),
		]
	}
	// whereClause.NOT = [
	//     {
	//         procurement: {
	//             status: {
	//                 status: -2
	//             }
	//         }
	//     },
	//     {
	//         procurement: {
	//             status: {
	//                 status: 2
	//             }
	//         }
	//     },
	// ]

	try {
		count = await prisma.acc_boq_outbox.count({
			where: whereClause,
		})
		const result = await prisma.acc_boq_outbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				reference_no: true,
				boq: {
					select: {
						reference_no: true,
						gst: true,
						estimated_cost: true,
						remark: true,
						status: true,
						isEdited: true,
						hsn_code: true,
						procurements: {
							select: {
								procurement_no: true,
								quantity: true,
								unit: true,
								rate: true,
								amount: true,
								remark: true,
								procurement: {
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
										description: true,
									},
								},
							},
						},
						boq_doc: {
							select: {
								ReferenceNo: true,
							},
						},
					},
				},
			},
		})

		await Promise.all(
			result.map(async item => {
				await Promise.all(
					item?.boq?.boq_doc.map(async (doc: any) => {
						const headers = {
							token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
						}
						await axios
							.post(process.env.DMS_GET || '', { referenceNo: doc?.ReferenceNo }, { headers })
							.then(response => {
								// console.log(response?.data?.data, 'res')
								doc.imageUrl = response?.data?.data?.fullPath
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

		let dataToSend: any[] = []
		result.forEach((item: any) => {
			const updatedProcurements = item?.boq?.procurements.map((proc: any) => {
				const { procurement, ...rest } = proc
				return { ...rest, ...procurement }
			})

			// Assign the updated array back to item.boq.procurements
			item.boq.procurements = updatedProcurements

			//flatten the boq object
			const { boq, ...rest } = item
			dataToSend.push({ ...rest, ...boq })
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
			data: dataToSend,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const forwardToDaDal = async (req: Request) => {
	const { reference_no }: { reference_no: string } = req.body
	try {
		const boq = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
			},
		})

		if (boq?.status !== -1) {
			throw {
				error: true,
				message: `Reference no. : ${reference_no} is not valid to be forwarded to DA.`,
			}
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.acc_boq_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.acc_boq_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_outbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.boq.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: 1,
					revised: true,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'BOQ to be approved',
					destination: 21,
					description: `There is a BOQ to be approved. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Forwarded to DA'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getPreTenderingInboxDal = async (req: Request) => {
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
				reference_no: {
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
	if (category[0] || subcategory[0] || brand[0]) {
		whereClause.AND = [
			...(category[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											category_masterId: {
												in: category,
											},
										},
									},
								},
							},
						},
					]
				: []),

			...(subcategory[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											subcategory_masterId: {
												in: subcategory,
											},
										},
									},
								},
							},
						},
					]
				: []),

			...(brand[0]
				? [
						{
							boq: {
								status: {
									in: status.map(Number),
								},
							},
						},
					]
				: []),

			...(brand[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											brand_masterId: {
												in: brand,
											},
										},
									},
								},
							},
						},
					]
				: []),
		]
	}

	try {
		count = await prisma.acc_pre_tender_inbox.count({
			where: whereClause,
		})
		const result = await prisma.acc_pre_tender_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				reference_no: true,
				tendering_form: {
					select: {
						boq: {
							select: {
								procurements: {
									select: {
										procurement: {
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
											},
										},
									},
								},
							},
						},
						status: true,
						isEdited: true,
						isPartial: true,
						remark: true,
					},
				},
			},
		})

		let dataToSend: any[] = []
		result.forEach((item: any) => {
			const updatedProcurements = item?.tendering_form?.boq?.procurements[0].procurement
			// Assign the updated array back
			item.tendering_form.boq.procurements = updatedProcurements

			// Flatten the tendering_form object
			const { tendering_form, ...restData } = item
			delete tendering_form.boq
			dataToSend.push({ ...restData, ...updatedProcurements, ...tendering_form })
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
			data: dataToSend,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getPreTenderingOutboxDal = async (req: Request) => {
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
				reference_no: {
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
	if (category[0] || subcategory[0] || brand[0]) {
		whereClause.AND = [
			...(category[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											category_masterId: {
												in: category,
											},
										},
									},
								},
							},
						},
					]
				: []),

			...(subcategory[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											subcategory_masterId: {
												in: subcategory,
											},
										},
									},
								},
							},
						},
					]
				: []),

			...(brand[0]
				? [
						{
							boq: {
								status: {
									in: status.map(Number),
								},
							},
						},
					]
				: []),

			...(brand[0]
				? [
						{
							boq: {
								procurements: {
									some: {
										procurement: {
											brand_masterId: {
												in: brand,
											},
										},
									},
								},
							},
						},
					]
				: []),
		]
	}

	try {
		count = await prisma.acc_pre_tender_outbox.count({
			where: whereClause,
		})
		const result = await prisma.acc_pre_tender_outbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				reference_no: true,
				tendering_form: {
					select: {
						boq: {
							select: {
								procurements: {
									select: {
										procurement: {
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
											},
										},
									},
								},
							},
						},
						status: true,
						isEdited: true,
						isPartial: true,
						remark: true,
					},
				},
			},
		})

		let dataToSend: any[] = []
		result.forEach((item: any) => {
			const updatedProcurements = item?.tendering_form?.boq?.procurements[0].procurement
			// Assign the updated array back
			item.tendering_form.boq.procurements = updatedProcurements

			// Flatten the tendering_form object
			const { tendering_form, ...restData } = item
			delete tendering_form.boq
			dataToSend.push({ ...restData, ...updatedProcurements, ...tendering_form })
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
			data: dataToSend,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

//Pre-tender|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

const checkExistence = async (reference_no: string) => {
	try {
		const count = await prisma.tendering_form.count({
			where: {
				reference_no: reference_no,
			},
		})

		return count !== 0 ? true : false
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

const isBoqValid = async (reference_no: string) => {
	try {
		const boq = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
			},
		})

		return boq?.status !== 0 ? false : true
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const createBasicDetailsPtDal = async (req: Request) => {
	const { preTender } = req.body
	try {
		const formattedData: basic_details = JSON.parse(typeof preTender !== 'string' ? JSON.stringify(preTender) : preTender)
		const img = req.files as Express.Multer.File[]

		if (!formattedData?.reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		const existence = await checkExistence(formattedData?.reference_no)

		if (!(await isBoqValid(formattedData?.reference_no))) {
			throw { error: true, message: 'BOQ is not valid to be forwarded for pre tender' }
		}
		const tableExistence = await prisma.basic_details.count({
			where: {
				reference_no: formattedData?.reference_no,
			},
		})

		const preparedData = {
			reference_no: formattedData?.reference_no,
			allow_offline_submission: Boolean(formattedData?.allow_offline_submission),
			allow_resubmission: Boolean(formattedData?.allow_resubmission),
			allow_withdrawl: Boolean(formattedData?.allow_withdrawl),
			payment_mode: formattedData?.payment_mode,
			onlinePyment_mode: formattedData?.onlinePyment_mode,
			offline_banks: formattedData?.offline_banks,
			contract_form: formattedData?.contract_form,
			tender_category: formattedData?.tender_category,
			tender_type: formattedData?.tender_type,
		}

		//start transaction
		await prisma.$transaction(async tx => {
			if (!existence) {
				await tx.tendering_form.create({
					data: {
						reference_no: formattedData?.reference_no,
					},
				})
				await tx.acc_pre_tender_inbox.create({
					data: {
						reference_no: formattedData?.reference_no,
					},
				})
			}

			if (!tableExistence) {
				await tx.basic_details.create({
					data: preparedData,
				})
			} else {
				await tx.basic_details.update({
					where: {
						reference_no: formattedData?.reference_no,
					},
					data: preparedData,
				})
			}

			if (img) {
				const uploaded = await imageUploader(img) //It will return reference number and unique id as an object after uploading.

				if (tableExistence) {
					await tx.tendering_form_docs.deleteMany({
						where: {
							reference_no: formattedData?.reference_no,
							form: 'basic_details',
						},
					})
				}

				await Promise.all(
					uploaded.map(async item => {
						await tx.tendering_form_docs.create({
							data: {
								reference_no: formattedData?.reference_no,
								form: 'basic_details',
								ReferenceNo: item?.ReferenceNo,
								uniqueId: item?.uniqueId,
							},
						})
					})
				)
			}
		})

		return !tableExistence ? 'Basic details added' : 'Basic details updated'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getBasicDetailsPtDal = async (req: Request) => {
	const { reference_no } = req.params
	try {
		if (!reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		// if (!await checkExistence(reference_no)) {
		//     throw { error: true, message: "Invalid pre-tender form" }
		// }

		const result = await prisma.basic_details.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				id: true,
				reference_no: true,
				allow_offline_submission: true,
				allow_resubmission: true,
				allow_withdrawl: true,
				payment_mode: true,
				onlinePyment_mode: true,
				offline_banks: true,
				contract_form: true,
				tender_category: true,
				tender_type: true,
			},
		})

		const doc = await prisma.tendering_form_docs.findMany({
			where: {
				reference_no: reference_no,
				form: 'basic_details',
			},
			select: {
				ReferenceNo: true,
			},
		})

		await Promise.all(
			doc.map(async (item: any) => {
				const headers = {
					token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
				}
				await axios
					.post(process.env.DMS_GET || '', { referenceNo: item?.ReferenceNo }, { headers })
					.then(response => {
						item.docUrl = response?.data?.data?.fullPath
					})
					.catch(err => {
						throw err
					})
			})
		)
		return result ? { ...result, doc: doc } : null
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const createWorkDetailsPtDal = async (req: Request) => {
	const { preTender } = req.body
	try {
		const formattedData: work_details = JSON.parse(typeof preTender !== 'string' ? JSON.stringify(preTender) : preTender)

		if (!formattedData?.reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		const existence = await checkExistence(formattedData?.reference_no)

		if (!(await isBoqValid(formattedData?.reference_no))) {
			throw { error: true, message: 'BOQ is not valid to be forwarded for pre tender' }
		}
		const tableExistence = await prisma.work_details.count({
			where: {
				reference_no: formattedData?.reference_no,
			},
		})

		const preparedData = {
			reference_no: formattedData?.reference_no,
			workDiscription: formattedData?.workDiscription,
			pre_qualification_details: formattedData?.pre_qualification_details,
			product_category: formattedData?.product_category,
			productSubCategory: formattedData?.productSubCategory,
			contract_type: formattedData?.contract_type,
			tender_values: formattedData?.tender_values,
			bid_validity: formattedData?.bid_validity,
			completionPeriod: Number(formattedData?.completionPeriod),
			location: formattedData?.location,
			pinCode: String(formattedData?.pinCode),
			pre_bid: Boolean(formattedData?.pre_bid),
			preBidMeeting: formattedData?.preBidMeeting,
			preBidMeetingAdd: formattedData?.preBidMeetingAdd,
			bidOpeningPlace: formattedData?.bidOpeningPlace,
			tenderer_class: formattedData?.tenderer_class,
			invstOffName: formattedData?.invstOffName,
			invstOffAdd: formattedData?.invstOffAdd,
			invstOffEmail_Ph: formattedData?.invstOffEmail_Ph,
		}

		//start transaction
		await prisma.$transaction(async tx => {
			if (!existence) {
				await tx.tendering_form.create({
					data: {
						reference_no: formattedData?.reference_no,
					},
				})
			}

			if (!tableExistence) {
				await tx.work_details.create({
					data: preparedData,
				})
			} else {
				await tx.work_details.update({
					where: {
						reference_no: formattedData?.reference_no,
					},
					data: preparedData,
				})
			}
		})

		return !tableExistence ? 'Work details added' : 'Work details updated'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getWorkDetailsPtDal = async (req: Request) => {
	const { reference_no } = req.params
	try {
		if (!reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		if (!(await checkExistence(reference_no))) {
			throw { error: true, message: 'Invalid pre-tender form' }
		}

		const result = await prisma.work_details.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				id: true,
				reference_no: true,
				workDiscription: true,
				pre_qualification_details: true,
				product_category: true,
				productSubCategory: true,
				contract_type: true,
				tender_values: true,
				bid_validity: true,
				completionPeriod: true,
				location: true,
				pinCode: true,
				pre_bid: true,
				preBidMeeting: true,
				preBidMeetingAdd: true,
				bidOpeningPlace: true,
				tenderer_class: true,
				invstOffName: true,
				invstOffAdd: true,
				invstOffEmail_Ph: true,
			},
		})

		return result ? result : null
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const createFeeDetailsPtDal = async (req: Request) => {
	const { preTender } = req.body
	try {
		const formattedData: fee_details = JSON.parse(typeof preTender !== 'string' ? JSON.stringify(preTender) : preTender)

		if (!formattedData?.reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		const existence = await checkExistence(formattedData?.reference_no)

		if (!(await isBoqValid(formattedData?.reference_no))) {
			throw { error: true, message: 'BOQ is not valid to be forwarded for pre tender' }
		}
		const tableExistence = await prisma.fee_details.count({
			where: {
				reference_no: formattedData?.reference_no,
			},
		})

		const preparedData = {
			reference_no: formattedData?.reference_no,
			tenderFee: Number(formattedData?.tenderFee),
			processingFee: Number(formattedData?.processingFee),
			tenderFeePayableTo: formattedData?.tenderFeePayableTo,
			tenderFeePayableAt: formattedData?.tenderFeePayableAt,
			surcharges: Number(formattedData?.surcharges),
			otherCharges: Number(formattedData?.otherCharges),
			emd_exemption: Boolean(formattedData?.emd_exemption),
			emd_fee: formattedData?.emd_fee,
			emdPercentage: Number(formattedData?.emdPercentage),
			emdAmount: Number(formattedData?.emdAmount),
			emdFeePayableTo: formattedData?.emdFeePayableTo,
			emdFeePayableAt: formattedData?.emdFeePayableAt,
		}

		//start transaction
		await prisma.$transaction(async tx => {
			if (!existence) {
				await tx.tendering_form.create({
					data: {
						reference_no: formattedData?.reference_no,
					},
				})
			}

			if (!tableExistence) {
				await tx.fee_details.create({
					data: preparedData,
				})
			} else {
				await tx.fee_details.update({
					where: {
						reference_no: formattedData?.reference_no,
					},
					data: preparedData,
				})
			}
		})

		return !tableExistence ? 'Fee details added' : 'Fee details updated'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getFeeDetailsPtDal = async (req: Request) => {
	const { reference_no } = req.params
	try {
		if (!reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		if (!(await checkExistence(reference_no))) {
			throw { error: true, message: 'Invalid pre-tender form' }
		}

		const result = await prisma.fee_details.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				id: true,
				reference_no: true,
				tenderFee: true,
				processingFee: true,
				tenderFeePayableTo: true,
				tenderFeePayableAt: true,
				surcharges: true,
				otherCharges: true,
				emd_exemption: true,
				emd_fee: true,
				emdPercentage: true,
				emdAmount: true,
				emdFeePayableTo: true,
				emdFeePayableAt: true,
			},
		})

		return result ? result : null
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const createCriticalDatesPtDal = async (req: Request) => {
	const { preTender } = req.body
	try {
		const formattedData: critical_dates = JSON.parse(typeof preTender !== 'string' ? JSON.stringify(preTender) : preTender)

		if (!formattedData?.reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		const existence = await checkExistence(formattedData?.reference_no)

		if (!(await isBoqValid(formattedData?.reference_no))) {
			throw { error: true, message: 'BOQ is not valid to be forwarded for pre tender' }
		}
		const tableExistence = await prisma.critical_dates.count({
			where: {
				reference_no: formattedData?.reference_no,
			},
		})

		const preparedData = {
			reference_no: formattedData?.reference_no,
			publishingDate: new Date(formattedData?.publishingDate),
			bidOpeningDate: new Date(formattedData?.bidOpeningDate),
			docSaleStartDate: new Date(formattedData?.docSaleStartDate),
			docSaleEndDate: new Date(formattedData?.docSaleEndDate),
			seekClariStrtDate: new Date(formattedData?.seekClariStrtDate),
			seekClariEndDate: new Date(formattedData?.seekClariEndDate),
			bidSubStrtDate: new Date(formattedData?.bidSubStrtDate),
			bidSubEndDate: new Date(formattedData?.bidSubEndDate),
			preBidMettingDate: new Date(formattedData?.preBidMettingDate),
		}

		//start transaction
		await prisma.$transaction(async tx => {
			if (!existence) {
				await tx.tendering_form.create({
					data: {
						reference_no: formattedData?.reference_no,
					},
				})
			}

			if (!tableExistence) {
				await tx.critical_dates.create({
					data: preparedData,
				})
			} else {
				await tx.critical_dates.update({
					where: {
						reference_no: formattedData?.reference_no,
					},
					data: preparedData,
				})
			}
		})

		return !tableExistence ? 'Critical dates added' : 'Critical dates updated'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getCriticalDatesPtDal = async (req: Request) => {
	const { reference_no } = req.params
	try {
		if (!reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		if (!(await checkExistence(reference_no))) {
			throw { error: true, message: 'Invalid pre-tender form' }
		}

		const result = await prisma.critical_dates.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				id: true,
				reference_no: true,
				publishingDate: true,
				bidOpeningDate: true,
				docSaleStartDate: true,
				docSaleEndDate: true,
				seekClariStrtDate: true,
				seekClariEndDate: true,
				bidSubStrtDate: true,
				bidSubEndDate: true,
				preBidMettingDate: true,
			},
		})

		return result ? result : null
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const createBidOpenersPtDal = async (req: Request) => {
	const { preTender, doc } = req.body
	const { B01, B02 } = (req.files as any) || {}
	try {
		const formattedData: bid_openers = JSON.parse(typeof preTender !== 'string' ? JSON.stringify(preTender) : preTender)
		const formattedDoc = JSON.parse(typeof doc !== 'string' ? JSON.stringify(doc) : doc)

		if (!formattedData?.reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		const existence = await checkExistence(formattedData?.reference_no)

		if (!(await isBoqValid(formattedData?.reference_no))) {
			throw { error: true, message: 'BOQ is not valid to be forwarded for pre tender' }
		}
		const tableExistence = await prisma.bid_openers.count({
			where: {
				reference_no: formattedData?.reference_no,
			},
		})

		const preparedData = {
			reference_no: formattedData?.reference_no,
			b01NameDesig: formattedData?.b01NameDesig,
			b01Email: formattedData?.b01Email,
			b02NameDesig: formattedData?.b02NameDesig,
			b02Email: formattedData?.b02Email,
			b03NameDesig: formattedData?.b03NameDesig,
			b03Email: formattedData?.b03Email,
		}
		let bid_openers_id: string | undefined = undefined
		//start transaction
		await prisma.$transaction(async tx => {
			if (!existence) {
				await tx.tendering_form.create({
					data: {
						reference_no: formattedData?.reference_no,
					},
				})
			}

			if (!tableExistence) {
				const created = await tx.bid_openers.create({
					data: preparedData,
				})
				bid_openers_id = created?.id
			} else {
				const updated = await tx.bid_openers.update({
					where: {
						reference_no: formattedData?.reference_no,
					},
					data: preparedData,
				})
				bid_openers_id = updated?.id
			}

			if (B01 && bid_openers_id) {
				const uploaded = await imageUploader(B01) //It will return reference number and unique id as an object after uploading.

				if (tableExistence) {
					await tx.bid_openers_docs.deleteMany({
						where: {
							bid_openersId: bid_openers_id,
							type: 'B01',
						},
					})
				}

				await Promise.all(
					uploaded.map(async item => {
						await tx.bid_openers_docs.create({
							data: {
								bid_openersId: bid_openers_id,
								type: 'B01',
								ReferenceNo: item?.ReferenceNo,
								uniqueId: item?.uniqueId,
								nameDesig: formattedDoc?.B01?.nameDesig,
								description: formattedDoc?.B01?.description,
								docSize: formattedDoc?.B01?.docSize,
							} as any,
						})
					})
				)
			}

			if (B02 && bid_openers_id) {
				const uploaded = await imageUploader(B02) //It will return reference number and unique id as an object after uploading.

				if (tableExistence) {
					await tx.bid_openers_docs.deleteMany({
						where: {
							bid_openersId: bid_openers_id,
							type: 'B02',
						},
					})
				}

				await Promise.all(
					uploaded.map(async item => {
						await tx.bid_openers_docs.create({
							data: {
								bid_openersId: bid_openers_id,
								type: 'B02',
								ReferenceNo: item?.ReferenceNo,
								uniqueId: item?.uniqueId,
								nameDesig: formattedDoc?.B02?.nameDesig,
								description: formattedDoc?.B02?.description,
								docSize: formattedDoc?.B02?.docSize,
							} as any,
						})
					})
				)
			}
		})

		return !tableExistence ? 'Bid openers added' : 'Bid openers updated'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getBidOpenersPtDal = async (req: Request) => {
	const { reference_no } = req.params
	try {
		if (!reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		if (!(await checkExistence(reference_no))) {
			throw { error: true, message: 'Invalid pre-tender form' }
		}

		const result = await prisma.bid_openers.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				id: true,
				reference_no: true,
				b01NameDesig: true,
				b01Email: true,
				b02NameDesig: true,
				b02Email: true,
				b03NameDesig: true,
				b03Email: true,
				bid_openers_docs: {
					select: {
						type: true,
						ReferenceNo: true,
						uniqueId: true,
						nameDesig: true,
						description: true,
						docSize: true,
					},
				},
			},
		})

		if (result) {
			await Promise.all(
				result?.bid_openers_docs.map(async (item: any) => {
					const headers = {
						token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
					}
					await axios
						.post(process.env.DMS_GET || '', { referenceNo: item?.ReferenceNo }, { headers })
						.then(response => {
							item.docUrl = response?.data?.data?.fullPath
						})
						.catch(err => {
							throw err
						})
				}) as any
			)
		}

		return result ? result : null
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const createCoverDetailsPtDal = async (req: Request) => {
	const preTender = req.body
	try {
		const formattedData = JSON.parse(typeof preTender !== 'string' ? JSON.stringify(preTender) : preTender)

		if (!formattedData?.reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		const existence = await checkExistence(formattedData?.reference_no)

		if (!(await isBoqValid(formattedData?.reference_no))) {
			throw { error: true, message: 'BOQ is not valid to be forwarded for pre tender' }
		}
		const tableExistence = await prisma.cover_details.count({
			where: {
				reference_no: formattedData?.reference_no,
			},
		})

		const preparedData = {
			reference_no: formattedData?.reference_no,
			noOfCovers: Number(formattedData?.noOfCovers),
			content: formattedData?.content,
		}
		let cover_details_id: string | undefined = undefined
		//start transaction
		await prisma.$transaction(async tx => {
			if (!existence) {
				await tx.tendering_form.create({
					data: {
						reference_no: formattedData?.reference_no,
					},
				})
			}

			if (!tableExistence) {
				const created = await tx.cover_details.create({
					data: preparedData,
				})
				cover_details_id = created?.id
			} else {
				const updated = await tx.cover_details.update({
					where: {
						reference_no: formattedData?.reference_no,
					},
					data: preparedData,
				})
				cover_details_id = updated?.id
			}

			if (formattedData?.tabs.length > 0 && cover_details_id) {
				if (tableExistence) {
					await tx.cover_details_docs.deleteMany({
						where: {
							cover_detailsId: cover_details_id,
						},
					})
				}

				await Promise.all(
					formattedData?.tabs.map(async (item: any) => {
						await tx.cover_details_docs.create({
							data: {
								cover_detailsId: cover_details_id,
								type: item?.value,
								docPath: item?.docs,
							} as cover_details_docs,
						})
					})
				)
			}
		})

		return !tableExistence ? 'Cover details added' : 'Cover details updated'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getCoverDetailsPtDal = async (req: Request) => {
	const { reference_no } = req.params
	try {
		if (!reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		if (!(await checkExistence(reference_no))) {
			throw { error: true, message: 'Invalid pre-tender form' }
		}

		const result = await prisma.cover_details.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				id: true,
				reference_no: true,
				noOfCovers: true,
				content: true,
				cover_details_docs: {
					select: {
						type: true,
						docPath: true,
					},
				},
			},
		})

		return result ? result : null
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getPreTenderDal = async (req: Request) => {
	const { reference_no } = req.params
	try {
		if (!reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		if (!(await checkExistence(reference_no))) {
			throw { error: true, message: 'Invalid pre-tender form' }
		}

		const result: any = await prisma.tendering_form.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				id: true,
				reference_no: true,
				status: true,
				isEdited: true,
				isPartial: true,
				basic_details: {
					select: {
						allow_offline_submission: true,
						allow_resubmission: true,
						allow_withdrawl: true,
						payment_mode: true,
						onlinePyment_mode: true,
						offline_banks: true,
						contract_form: true,
						tender_category: true,
						tender_type: true,
					},
				},
				cover_details: {
					select: {
						noOfCovers: true,
						content: true,
						cover_details_docs: {
							select: {
								type: true,
								docPath: true,
							},
						},
					},
				},
				work_details: {
					select: {
						workDiscription: true,
						pre_qualification_details: true,
						product_category: true,
						productSubCategory: true,
						contract_type: true,
						tender_values: true,
						bid_validity: true,
						completionPeriod: true,
						location: true,
						pinCode: true,
						pre_bid: true,
						preBidMeeting: true,
						preBidMeetingAdd: true,
						bidOpeningPlace: true,
						tenderer_class: true,
						invstOffName: true,
						invstOffAdd: true,
						invstOffEmail_Ph: true,
					},
				},
				fee_details: {
					select: {
						tenderFee: true,
						processingFee: true,
						tenderFeePayableTo: true,
						tenderFeePayableAt: true,
						surcharges: true,
						otherCharges: true,
						emd_exemption: true,
						emd_fee: true,
						emdPercentage: true,
						emdAmount: true,
						emdFeePayableTo: true,
						emdFeePayableAt: true,
					},
				},
				critical_dates: {
					select: {
						publishingDate: true,
						bidOpeningDate: true,
						docSaleStartDate: true,
						docSaleEndDate: true,
						seekClariStrtDate: true,
						seekClariEndDate: true,
						bidSubStrtDate: true,
						bidSubEndDate: true,
						preBidMettingDate: true,
					},
				},
				bid_openers: {
					select: {
						id: true,
						reference_no: true,
						b01NameDesig: true,
						b01Email: true,
						b02NameDesig: true,
						b02Email: true,
						b03NameDesig: true,
						b03Email: true,
						bid_openers_docs: {
							select: {
								type: true,
								ReferenceNo: true,
								uniqueId: true,
								nameDesig: true,
								description: true,
								docSize: true,
							},
						},
					},
				},
			},
		})

		//Append document in basic details
		if (result?.basic_details) {
			const basicDetailsDoc = await prisma.tendering_form_docs.findMany({
				where: {
					reference_no: reference_no,
					form: 'basic_details',
				},
				select: {
					ReferenceNo: true,
				},
			})

			await Promise.all(
				basicDetailsDoc.map(async (item: any) => {
					const headers = {
						token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
					}
					await axios
						.post(process.env.DMS_GET || '', { referenceNo: item?.ReferenceNo }, { headers })
						.then(response => {
							item.docUrl = response?.data?.data?.fullPath
						})
						.catch(err => {
							throw err
						})
				})
			)

			result.basic_details.doc = basicDetailsDoc
		}

		//Append document in bid openers
		if (result?.bid_openers) {
			await Promise.all(
				result?.bid_openers?.bid_openers_docs.map(async (item: any) => {
					const headers = {
						token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
					}
					await axios
						.post(process.env.DMS_GET || '', { referenceNo: item?.ReferenceNo }, { headers })
						.then(response => {
							item.docUrl = response?.data?.data?.fullPath
						})
						.catch(err => {
							throw err
						})
				}) as any
			)
		}

		return result ? result : null
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const finalSubmissionPtDal = async (req: Request) => {
	const { reference_no } = req.body
	try {
		if (!reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		if (!(await checkExistence(reference_no))) {
			throw { error: true, message: 'Invalid pre-tender form' }
		}

		//existence check for basic details
		const basicDetailsCount = await prisma.basic_details.count({
			where: {
				reference_no: reference_no,
			},
		})
		if (basicDetailsCount === 0) throw { error: true, message: 'Basic details form is not filled completely' }

		//existence check for cover details
		const coverDetailsCount = await prisma.cover_details.count({
			where: {
				reference_no: reference_no,
			},
		})
		if (coverDetailsCount === 0) throw { error: true, message: 'Cover details form is not filled completely' }

		//existence check for work details
		const workDetailsCount = await prisma.work_details.count({
			where: {
				reference_no: reference_no,
			},
		})
		if (workDetailsCount === 0) throw { error: true, message: 'Work details form is not filled completely' }

		//existence check for fee details
		const feeDetailsCount = await prisma.fee_details.count({
			where: {
				reference_no: reference_no,
			},
		})
		if (feeDetailsCount === 0) throw { error: true, message: 'Fee details form is not filled completely' }

		//existence check for work details
		const criticalDatesCount = await prisma.critical_dates.count({
			where: {
				reference_no: reference_no,
			},
		})
		if (criticalDatesCount === 0) throw { error: true, message: 'Critical dates form is not filled completely' }

		//existence check for work details
		const bidOpenersCount = await prisma.bid_openers.count({
			where: {
				reference_no: reference_no,
			},
		})
		if (bidOpenersCount === 0) throw { error: true, message: 'Bid openers form is not filled completely' }

		await prisma.tendering_form.update({
			where: {
				reference_no: reference_no,
			},
			data: {
				isPartial: false,
			},
		})

		return ` ${reference_no} is filled completely and ready to be forwarded`
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const forwardToDaPtDal = async (req: Request) => {
	const { reference_no }: { reference_no: string } = req.body
	try {
		const preTender = await prisma.tendering_form.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
				isPartial: true,
			},
		})

		if (preTender?.status !== -1 && preTender?.status !== 0) {
			throw {
				error: true,
				message: `Reference no. : ${reference_no} is not valid to be forwarded to DA.`,
			}
		}

		if (preTender?.isPartial) {
			throw {
				error: true,
				message: `Please fill all the forms and submit before forwarding to DA`,
			}
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.acc_pre_tender_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.acc_pre_tender_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_pre_tender_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			// await tx.da_pre_tender_outbox.delete({
			//     where: {
			//         reference_no: reference_no
			//     }
			// })

			const record = await prisma.da_pre_tender_outbox.findUnique({
				where: { reference_no: reference_no },
			})

			if (record) {
				await tx.da_pre_tender_outbox.delete({
					where: { reference_no: reference_no },
				})
			}

			await tx.tendering_form.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: 1,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'Pre-tendering form to be approved',
					destination: 22,
					description: `There is a pre-tendering form to be approved. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Forwarded to DA'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

//Pre-tender|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

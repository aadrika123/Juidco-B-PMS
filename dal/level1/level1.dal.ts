import { Request } from 'express'
import { PrismaClient, basic_details, bid_openers, cover_details, cover_details_docs, critical_dates, fee_details, work_details } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { imageUploader } from '../../lib/imageUploader'
import { pagination, uploadedDoc } from '../../type/common.type'
import { boqData } from '../../type/accountant.type'
import generateReferenceNumber from '../../lib/referenceNumberGenerator'
import axios from 'axios'

const prisma = new PrismaClient()

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
		count = await prisma.level1_inbox.count({
			where: whereClause,
		})
		const result = await prisma.level1_inbox.findMany({
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

		// await Promise.all(
		// 	result.map(async item => {
		// 		await Promise.all(
		// 			item?.boq?.boq_doc.map(async (doc: any) => {
		// 				const headers = {
		// 					token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
		// 				}
		// 				await axios
		// 					.post(process.env.DMS_GET || '', { referenceNo: doc?.ReferenceNo }, { headers })
		// 					.then(response => {
		// 						// console.log(response?.data?.data, 'res')
		// 						doc.imageUrl = response?.data?.data?.fullPath
		// 					})
		// 					.catch(err => {
		// 						// console.log(err?.data?.data, 'err')
		// 						// toReturn.push(err?.data?.data)
		// 						throw err
		// 					})
		// 			})
		// 		)
		// 	})
		// )

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
		count = await prisma.level1_outbox.count({
			where: whereClause,
		})
		const result = await prisma.level1_outbox.findMany({
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

		// await Promise.all(
		// 	result.map(async item => {
		// 		await Promise.all(
		// 			item?.boq?.boq_doc.map(async (doc: any) => {
		// 				const headers = {
		// 					token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
		// 				}
		// 				await axios
		// 					.post(process.env.DMS_GET || '', { referenceNo: doc?.ReferenceNo }, { headers })
		// 					.then(response => {
		// 						// console.log(response?.data?.data, 'res')
		// 						doc.imageUrl = response?.data?.data?.fullPath
		// 					})
		// 					.catch(err => {
		// 						// console.log(err?.data?.data, 'err')
		// 						// toReturn.push(err?.data?.data)
		// 						throw err
		// 					})
		// 			})
		// 		)
		// 	})
		// )

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

export const forwardToLevel2Dal = async (req: Request) => {
	const { reference_no }: { reference_no: string } = req.body
	try {
		if (!reference_no) {
			throw {
				error: true,
				message: `Reference no is required as 'reference_no'`,
			}
		}

		const boq = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
			},
		})

		if (boq?.status !== 1) {
			throw {
				error: true,
				message: `Reference no. : ${reference_no} is not valid BOQ to be forwarded.`,
			}
		}

		const preTender = await prisma.tendering_form.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
				isPartial: true,
			},
		})

		if (preTender?.status !== 1 && preTender?.isPartial === false) {
			throw {
				error: true,
				message: `Reference no. : ${reference_no} is not valid Pre tender form to be forwarded.`,
			}
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.level1_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.level1_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.level2_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			// await tx.da_boq_outbox.delete({
			// 	where: {
			// 		reference_no: reference_no,
			// 	},
			// })

			await tx.boq.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: 2,
				},
			})

			await tx.tendering_form.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: 2,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_LEVEL2),
					title: 'BOQ and Pre tender form to be reviewed',
					destination: 60,
					description: `There is a BOQ and Pre tender form to be approved. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Forwarded to level 2'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const returnToDaDal = async (req: Request) => {
	const { reference_no, remark }: { reference_no: string; remark: string } = req.body
	try {
		if (!reference_no) {
			throw {
				error: true,
				message: `Reference no is required as 'reference_no'`,
			}
		}

		const boqData = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
			},
		})

		if (boqData?.status !== 1) {
			throw {
				error: true,
				message: 'Invalid status of BOQ to return',
			}
		}

		if (!remark) {
			throw { error: true, message: 'Remark is mandatory' }
		}

		const preTender = await prisma.tendering_form.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
				isPartial: true,
			},
		})

		if (preTender?.status !== 1 && preTender?.status !== 12 && preTender?.isPartial === false) {
			throw {
				error: true,
				message: `Reference no. : ${reference_no} is not valid Pre tender form to be returned.`,
			}
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.level1_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.level1_outbox.create({
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
					status: -1,
					remark: remark,
				},
			})

			await tx.tendering_form.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: -1,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'BOQ returned',
					destination: 21,
					description: `There is a BOQ returned from level 1. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Returned to DA'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const approvalByLevel1Dal = async (req: Request) => {
	const { reference_no }: { reference_no: string } = req.body
	try {
		if (!reference_no) {
			throw {
				error: true,
				message: `Reference no is required as 'reference_no'`,
			}
		}

		const boqData = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
			},
		})

		if (boqData?.status !== 1) {
			throw { error: true, message: 'Invalid status of BOQ to be approved' }
		}

		const preTender = await prisma.tendering_form.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
				isPartial: true,
			},
		})

		if (preTender?.status !== 1 && preTender?.isPartial === false) {
			throw {
				error: true,
				message: `Reference no. : ${reference_no} is not valid Pre tender form to be approved.`,
			}
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.level1_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.level1_outbox.create({
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
					status: 11,
					remark: '' as string,
				},
			})

			await tx.tendering_form.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: 11,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'BOQ and pre tender approved by level 1',
					destination: 21,
					description: `There are BOQ and pre tender approved by level 1. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Approved by level 1'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const rejectionByLevel1Dal = async (req: Request) => {
	const { reference_no }: { reference_no: string } = req.body
	try {
		if (!reference_no) {
			throw {
				error: true,
				message: `Reference no is required as 'reference_no'`,
			}
		}

		const boqData = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
			},
		})

		if (boqData?.status !== 1) {
			throw { error: true, message: 'Invalid status of BOQ to be rejected' }
		}

		const preTender = await prisma.tendering_form.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
				isPartial: true,
			},
		})

		if (preTender?.status !== 1 && preTender?.isPartial === false) {
			throw {
				error: true,
				message: `Reference no. : ${reference_no} is not valid Pre tender form to be rejected.`,
			}
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.level1_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.level1_outbox.create({
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
					status: -2,
					remark: '' as string,
				},
			})

			await tx.tendering_form.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: -2,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'BOQ and pre tender rejected by level 1',
					destination: 21,
					description: `There are BOQ and pre tender rejected by level 1. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Approved by level 1'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

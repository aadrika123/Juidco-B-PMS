import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { imageUploader } from '../../lib/imageUploader'
import { pagination } from '../../type/common.type'
import { extractRoleName } from '../../lib/roleNameExtractor'

const prisma = new PrismaClient()

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

	try {
		count = await prisma.da_pre_procurement_inbox.count({
			where: whereClause,
		})
		const result = await prisma.da_pre_procurement_inbox.findMany({
			orderBy: {
				createdAt: 'desc',
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
						// remark: true,
						// quantity: true,
						// rate: true,
						total_rate: true,
						isEdited: true,
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

export const getPreProcurementByIdDal = async (req: Request) => {
	const { id } = req.params
	try {
		const result: any = await prisma.da_pre_procurement_inbox.findFirst({
			where: {
				id: id,
			},
			select: {
				id: true,
				procurement_no: true,
				procurement: {
					select: {
						// procurement_no: true,
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
		const result: any = await prisma.da_pre_procurement_inbox.findFirst({
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

export const backToSrDal = async (req: Request) => {
	const { preProcurement, remark }: { preProcurement: string[]; remark: string } = req.body
	try {
		preProcurement.map(async item => {
			const inbox: any = await prisma.da_pre_procurement_inbox.findFirst({
				where: {
					id: item,
				},
				select: {
					procurement_no: true,
				},
			})
			if (inbox === null) {
				return
			}
			await prisma.$transaction([
				prisma.da_pre_procurement_outbox.create({
					data: inbox,
				}),
				prisma.sr_pre_procurement_inbox.create({
					data: inbox,
				}),
				prisma.procurement.update({
					where: {
						procurement_no: inbox?.procurement_no,
					},
					data: {
						remark: remark,
					},
				}),
				prisma.procurement_status.update({
					where: {
						procurement_no: inbox?.procurement_no,
					},
					data: {
						status: -1,
					},
				}),
				prisma.da_pre_procurement_inbox.delete({
					where: {
						id: item,
					},
				}),
				prisma.sr_pre_procurement_outbox.delete({
					where: {
						procurement_no: inbox?.procurement_no,
					},
				}),
				prisma.notification.create({
					data: {
						role_id: Number(process.env.ROLE_SR),
						title: 'Procurement returned',
						destination: 10,
						from: await extractRoleName(Number(process.env.ROLE_DA)),
						description: `There is a procurement returned from DA to be revised. Procurement Number : ${inbox?.procurement_no}`,
					},
				}),
			])
		})
		return 'Reversed'
	} catch (err: any) {
		console.log(err?.message)
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
		remark: remark,
		isEdited: true,
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
		...(unit && { unit: { connect: { id: unit } } }),
		brand: { connect: { id: procurement?.brand_masterId } },
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
			prisma.notification.create({
				data: {
					role_id: Number(process.env.ROLE_SR),
					title: 'Procurement edited by DA',
					destination: 10,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `There is a procurement Edited by DA. Procurement Number : ${procurement_no}`,
				},
			}),
		])
		return 'Edited'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const releaseForTenderDal = async (req: Request) => {
	const { preProcurement }: { preProcurement: string } = req.body
	const img = req.files
	try {
		await Promise.all(
			JSON.parse(preProcurement).map(async (item: string) => {
				const inbox: any = await prisma.da_pre_procurement_inbox.findFirst({
					where: {
						id: item,
					},
					select: {
						procurement_no: true,
					},
				})

				if (inbox === null) {
					throw { error: true, message: 'Invalid inbox ID' }
				}

				if (img) {
					const uploaded = await imageUploader(img) //It will return reference number and unique id as an object after uploading.

					await Promise.all(
						uploaded.map(async item => {
							await prisma.note_sheet.create({
								data: {
									procurement_no: inbox?.procurement_no,
									ReferenceNo: item?.ReferenceNo,
									uniqueId: item?.uniqueId,
									operation: 2,
								},
							})
						})
					)
				}

				await prisma.$transaction([
					prisma.da_pre_procurement_outbox.create({
						data: inbox,
					}),
					prisma.sr_pre_procurement_inbox.create({
						data: inbox,
					}),
					prisma.da_post_procurement_inbox.create({
						data: inbox,
					}),
					prisma.procurement_status.update({
						where: {
							procurement_no: inbox?.procurement_no,
						},
						data: {
							status: 2,
						},
					}),
					prisma.da_pre_procurement_inbox.delete({
						where: {
							id: item,
						},
					}),
					prisma.sr_pre_procurement_outbox.delete({
						where: {
							procurement_no: inbox?.procurement_no,
						},
					}),
				])
			})
		)
		return 'Released for tender'
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const releaseForTenderByProcNoDal = async (req: Request) => {
	const { procurement }: { procurement: string } = req.body
	const img = req.files
	const formattedProcurement = typeof procurement !== 'string' ? JSON.stringify(procurement) : procurement
	try {
		await Promise.all(
			JSON.parse(formattedProcurement).map(async (procurement_no: string) => {
				const inbox: number = await prisma.da_pre_procurement_inbox.count({
					where: {
						procurement_no: procurement_no,
					},
				})

				if (inbox === 0) {
					throw { error: true, message: 'Invalid procurement number' }
				}

				if (img) {
					const uploaded = await imageUploader(img) //It will return reference number and unique id as an object after uploading.

					await Promise.all(
						uploaded.map(async item => {
							await prisma.note_sheet.create({
								data: {
									procurement_no: procurement_no,
									ReferenceNo: item?.ReferenceNo,
									uniqueId: item?.uniqueId,
									operation: 2,
								},
							})
						})
					)
				}

				await prisma.$transaction([
					prisma.da_pre_procurement_outbox.create({
						data: { procurement_no: procurement_no },
					}),
					prisma.sr_pre_procurement_inbox.create({
						data: { procurement_no: procurement_no },
					}),
					prisma.da_post_procurement_inbox.create({
						data: { procurement_no: procurement_no },
					}),
					prisma.procurement_status.update({
						where: {
							procurement_no: procurement_no,
						},
						data: {
							status: 2,
						},
					}),
					// prisma.acc_pre_procurement_inbox.delete({
					//     where: {
					//         procurement_no: procurement_no,
					//     },
					// }),
					prisma.sr_pre_procurement_outbox.delete({
						where: {
							procurement_no: procurement_no,
						},
					}),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_SR),
							title: 'Procurement released for tender',
							destination: 15,
							from: await extractRoleName(Number(process.env.ROLE_DA)),
							description: `There is a procurement released for tender. Procurement Number : ${procurement_no}`,
						},
					}),
				])
			})
		)
		return 'Released for tender'
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

	try {
		count = await prisma.da_pre_procurement_outbox.count({
			where: whereClause,
		})
		const result = await prisma.da_pre_procurement_outbox.findMany({
			orderBy: {
				createdAt: 'desc',
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

export const getPreProcurementOutboxByIdDal = async (req: Request) => {
	const { id } = req.params
	try {
		const result: any = await prisma.da_pre_procurement_outbox.findFirst({
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

export const rejectByProcurementNoDal = async (req: Request) => {
	const { procurement_no, remark }: { procurement_no: string[]; remark: string } = req.body
	try {
		procurement_no.map(async item => {
			await prisma.$transaction([
				prisma.da_pre_procurement_outbox.create({
					data: { procurement_no: item },
				}),
				prisma.sr_pre_procurement_inbox.create({
					data: { procurement_no: item },
				}),
				prisma.procurement.update({
					where: {
						procurement_no: item,
					},
					data: {
						remark: remark,
					},
				}),
				prisma.procurement_status.update({
					where: {
						procurement_no: item,
					},
					data: {
						status: -2,
					},
				}),
				prisma.da_pre_procurement_inbox.delete({
					where: {
						procurement_no: item,
					},
				}),
				prisma.sr_pre_procurement_outbox.delete({
					where: {
						procurement_no: item,
					},
				}),
				prisma.notification.create({
					data: {
						role_id: Number(process.env.ROLE_SR),
						title: 'Procurement rejected',
						destination: 14,
						from: await extractRoleName(Number(process.env.ROLE_DA)),
						description: `There is a procurement rejected. Procurement Number : ${procurement_no}`,
					},
				}),
			])
		})
		return 'Rejected'
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const rejectDal = async (req: Request) => {
	const { preProcurement, remark }: { preProcurement: string[]; remark: string } = req.body
	try {
		preProcurement.map(async item => {
			const inbox: any = await prisma.da_pre_procurement_inbox.findFirst({
				where: {
					id: item,
				},
				select: {
					procurement_no: true,
				},
			})
			if (inbox === null) {
				return
			}
			await prisma.$transaction([
				prisma.da_pre_procurement_outbox.create({
					data: inbox,
				}),
				prisma.sr_pre_procurement_inbox.create({
					data: inbox,
				}),
				prisma.procurement.update({
					where: {
						procurement_no: inbox?.procurement_no,
					},
					data: {
						remark: remark,
					},
				}),
				prisma.procurement_status.update({
					where: {
						procurement_no: inbox?.procurement_no,
					},
					data: {
						status: -2,
					},
				}),
				prisma.da_pre_procurement_inbox.delete({
					where: {
						id: item,
					},
				}),
				prisma.sr_pre_procurement_outbox.delete({
					where: {
						procurement_no: inbox?.procurement_no,
					},
				}),
				prisma.notification.create({
					data: {
						role_id: Number(process.env.ROLE_SR),
						title: 'Procurement rejected',
						destination: 14,
						from: await extractRoleName(Number(process.env.ROLE_DA)),
						description: `There is a procurement rejected. Procurement Number : ${inbox?.procurement_no}`,
					},
				}),
			])
		})
		return 'Reversed'
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const forwardToAccountantDal = async (req: Request) => {
	const { preProcurement }: { preProcurement: string } = req.body
	const img = req.files
	try {
		await Promise.all(
			JSON.parse(preProcurement).map(async (item: string) => {
				const inbox: any = await prisma.da_pre_procurement_inbox.findFirst({
					where: {
						id: item,
					},
					select: {
						procurement_no: true,
					},
				})

				if (inbox === null) {
					throw { error: true, message: 'Invalid inbox ID' }
				}

				if (img) {
					const uploaded = await imageUploader(img) //It will return reference number and unique id as an object after uploading.

					await Promise.all(
						uploaded.map(async item => {
							await prisma.note_sheet.create({
								data: {
									procurement_no: inbox?.procurement_no,
									ReferenceNo: item?.ReferenceNo,
									uniqueId: item?.uniqueId,
									operation: 11,
								},
							})
						})
					)
				}

				await prisma.$transaction([
					prisma.da_pre_procurement_outbox.create({
						data: inbox,
					}),
					prisma.acc_pre_procurement_inbox.create({
						data: inbox,
					}),
					prisma.procurement_status.update({
						where: {
							procurement_no: inbox?.procurement_no,
						},
						data: {
							status: 70,
						},
					}),
					prisma.da_pre_procurement_inbox.delete({
						where: {
							id: item,
						},
					}),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_ACC),
							title: 'Procurement for BOQ',
							destination: 30,
							from: await extractRoleName(Number(process.env.ROLE_DA)),
							description: `There is a procurement for BOQ. Procurement Number : ${inbox?.procurement_no}`,
						},
					}),
				])
			})
		)
		return 'Released for BOQ'
	} catch (err: any) {
		console.log(err?.message)
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
			// {
			// 	boq: {
			// 		procurements: {
			// 			some: {
			// 				procurement: {
			// 					description: {
			// 						contains: search,
			// 						mode: 'insensitive',
			// 					},
			// 				},
			// 			},
			// 		},
			// 	},
			// },
			{
				boq: {
				  procurement_stocks: {
					some: {
					  procurement_no: {
						contains: search,
						mode: 'insensitive',
					  },
					},
				  },
				},
			  },
		]
	}

	//creating filter options for the query
	if (category[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						category_masterId: {
							in: category,
						},
					},
				},
			},
		}
	}
	if (subcategory[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						subcategory_masterId: {
							in: subcategory,
						},
					},
				},
			},
		}
	}
	if (status[0]) {
		whereClause.boq = {
			status: {
				in: status.map(Number),
			},
		}
	}
	if (brand[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						brand_masterId: {
							in: brand,
						},
					},
				},
			},
		}
	}

	try {
		count = await prisma.da_boq_inbox.count({
			where: whereClause,
		})
		const result = await prisma.da_boq_inbox.findMany({
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
						hsn_code: true,
						remark: true,
						status: true,
						isEdited: true,
						procurement_stocks: {
							select: {
								procurement_no: true,
								quantity: true,
								rate: true,
								remark: true,
								category: {
									select: {
										name: true,
									},
								},
								subCategory: {
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
						boq_doc: {
							select: {
								docPath: true,
							},
						},
					},
				},
			},
		})

		let dataToSend: any[] = []
		result.forEach((item: any) => {
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
			// {
			// 	boq: {
			// 		procurements: {
			// 			some: {
			// 				procurement: {
			// 					description: {
			// 						contains: search,
			// 						mode: 'insensitive',
			// 					},
			// 				},
			// 			},
			// 		},
			// 	},
			// },
		]
	}

	//creating filter options for the query
	if (category[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						category_masterId: {
							in: category,
						},
					},
				},
			},
		}
	}
	if (subcategory[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						subcategory_masterId: {
							in: subcategory,
						},
					},
				},
			},
		}
	}
	if (status[0]) {
		whereClause.boq = {
			status: {
				in: status.map(Number),
			},
		}
	}
	if (brand[0]) {
		whereClause.boq = {
			procurement_stocks: {
				some: {
					procurement: {
						brand_masterId: {
							in: brand,
						},
					},
				},
			},
		}
	}

	try {
		count = await prisma.da_boq_outbox.count({
			where: whereClause,
		})
		const result = await prisma.da_boq_outbox.findMany({
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
						hsn_code: true,
						remark: true,
						status: true,
						isEdited: true,
						procurement_stocks: {
							select: {
								procurement_no: true,
								quantity: true,
								rate: true,
								remark: true,
								category: {
									select: {
										name: true,
									},
								},
								subCategory: {
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
						boq_doc: {
							select: {
								docPath: true,
							},
						},
					},
				},
			},
		})

		let dataToSend: any[] = []
		result.forEach((item: any) => {
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

export const forwardToFinanceDal = async (req: Request) => {
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

		if (boq?.status !== 0 && boq?.status !== 41) {
			throw {
				error: true,
				message: `Reference no. : ${reference_no} is not valid BOQ to be forwarded.`,
			}
		}

		const financeOutbox = await prisma.finance_boq_outbox.count({
			where: {
				reference_no: reference_no
			}
		})

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.da_boq_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.finance_boq_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			if (financeOutbox !== 0) {
				await tx.finance_boq_outbox.delete({
					where: {
						reference_no: reference_no,
					},
				})
			}

			await tx.boq.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: 40,
					procurement: {
						update: {
							status: 100
						}
					}
				},
			})

			// await tx.notification.create({
			// 	data: {
			// 		role_id: Number(process.env.ROLE_LEVEL1),
			// 		title: 'BOQ and Pre tender form to be approved',
			// 		destination: 21,
			// 		description: `There is a BOQ and Pre tender form to be approved. Reference Number : ${reference_no}`,
			// 	},
			// })
		})

		return 'Forwarded to finance'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const proceedForPostProcurementDal = async (req: Request) => {
	const { reference_no }: { reference_no: string } = req.body
	try {
		if (!reference_no) {
			throw { error: true, message: 'Reference number is required' }
		}

		const boq = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
				procurement: {
					select: {
						procurement_no: true,
						is_rate_contract: true,
					},
				},
			},
		})

		if (boq?.procurement?.is_rate_contract === false) {
			throw { error: true, message: 'This operation is only valid for rate contract' }
		}

		if (boq?.status !== 42) {
			throw {
				error: true,
				message: `Reference no. : ${reference_no} is not valid BOQ to be proceed.`,
			}
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.da_boq_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_post_procurement_inbox.create({
				data: {
					procurement_no: boq?.procurement?.procurement_no as string,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_IA),
					title: 'Procurement ready for post procurement',
					destination: 23,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `There is a procurement ready for post procurement. Procurement Number : ${boq?.procurement?.procurement_no as string}`,
				},
			})
		})

		return 'Forwarded for post procurement'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const returnToAccountantDal = async (req: Request) => {
	const { reference_no, remark }: { reference_no: string; remark: string } = req.body
	try {
		const boqData = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
			},
		})

		if (boqData?.status !== 0 && boqData?.status !== 1) {
			throw {
				error: true,
				message: 'Invalid status of BOQ for returning back to accountant',
			}
		}

		if (!remark) {
			throw { error: true, message: 'Remark is mandatory' }
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.da_boq_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.acc_boq_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.acc_boq_outbox.delete({
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

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_ACC),
					title: 'BOQ returned',
					destination: 31,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `There is a BOQ returned from DA. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Returned to accountant'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const rejectBoqDal = async (req: Request) => {
	const { reference_no, remark }: { reference_no: string; remark: string } = req.body
	try {
		const boqData = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
				procurements: {
					select: {
						procurement_no: true,
					},
				},
			},
		})

		if (boqData?.status !== 0) {
			throw { error: true, message: 'Invalid status of BOQ for rejecting' }
		}

		if (!remark) {
			throw { error: true, message: 'Remark is mandatory' }
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.da_boq_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.acc_boq_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.acc_boq_outbox.delete({
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
					remark: remark,
				},
			})

			const procurement_no_array = boqData?.procurements.map(item => item?.procurement_no)

			req.body = {
				procurement_no: procurement_no_array,
				remark: 'BOQ rejected',
			}
			const result: any = await rejectByProcurementNoDal(req)
			if (result?.error) {
				throw { error: true, message: 'Error while rejecting procurement' }
			}

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_ACC),
					title: 'BOQ rejected',
					destination: 31,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `There is a BOQ rejected. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Rejected'
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
		count = await prisma.da_pre_tender_inbox.count({
			where: whereClause,
		})
		const result = await prisma.da_pre_tender_inbox.findMany({
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
		count = await prisma.da_pre_tender_outbox.count({
			where: whereClause,
		})
		const result = await prisma.da_pre_tender_outbox.findMany({
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

export const approveBoqForPtDal = async (req: Request) => {
	const { reference_no }: { reference_no: string } = req.body
	try {
		const boqData = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
			},
		})

		if (boqData?.status !== 0 && boqData?.status !== 1) {
			throw { error: true, message: 'Invalid status of BOQ to be approved' }
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.da_boq_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.acc_boq_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_boq_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.acc_boq_outbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.boq.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: 2,
					remark: '' as string,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_ACC),
					title: 'BOQ approved',
					destination: 31,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `There is a BOQ approved for pre-tendering form. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Approved for pre tender'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const approvePreTenderDal = async (req: Request) => {
	const { reference_no }: { reference_no: string } = req.body
	try {
		const preTenderData = await prisma.tendering_form.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
				isPartial: true,
				boq: {
					select: {
						procurements: {
							select: {
								procurement_no: true,
							},
						},
					},
				},
			},
		})

		if (preTenderData?.status !== 1 && preTenderData?.status !== 69) {
			throw { error: true, message: 'Invalid status of pre tender to be approved' }
		}

		if (preTenderData?.isPartial) {
			throw { error: true, message: 'Pre tender form is partially filled' }
		}

		// start transaction
		await prisma.$transaction(async tx => {
			await tx.da_pre_tender_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.acc_pre_tender_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_pre_tender_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.acc_pre_tender_outbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.tendering_form.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: 2,
					remark: '' as string,
				},
			})

			const procurement = preTenderData?.boq?.procurements.map(item => item?.procurement_no) //append all procurement numbers inside an array to send

			//update the original procurement using BOQ procurement which was approved
			await Promise.all(
				procurement.map(async (procurement_no: string) => {
					const proc: any = await prisma.procurement.findFirst({
						where: {
							procurement_no: procurement_no,
						},
						select: {
							procurement_no: true,
							// category_masterId: true,
							// subcategory_masterId: true,
							// brand_masterId: true,
							// description: true,
							// quantity: true,
							// rate: true,
							// unit: true,
							total_rate: true,
							remark: true,
						},
					})

					const boqProc = await prisma.boq_procurement.findFirst({
						where: {
							procurement_no: procurement_no,
						},
						select: {
							unit: true,
							rate: true,
							amount: true,
							remark: true,
						},
					})

					await tx.procurement_before_boq.create({
						data: {
							procurement_no: proc.procurement_no,
							category_masterId: proc.category_masterId,
							subcategory_masterId: proc.subcategory_masterId,
							brand_masterId: proc.brand_masterId,
							description: proc.description,
							quantity: proc.quantity,
							rate: proc.rate,
							unit: proc.unit ?? undefined,
							total_rate: proc.total_rate,
							remark: proc.remark ?? undefined,
						},
					})

					await tx.procurement.update({
						where: {
							procurement_no: procurement_no,
						},
						data: {
							// rate: boqProc?.rate,
							total_rate: boqProc?.amount,
							remark: boqProc?.remark,
							// unit: boqProc?.unit,
						},
					})
				})
			)

			req.body.procurement = procurement

			const result: any = await releaseForTenderByProcNoDal(req)
			if (result?.error) {
				throw { error: true, message: 'Error while releasing procurement' }
			}

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_ACC),
					title: 'Pre-tendering form approved',
					destination: 32,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `There is a pre-tendering form approved. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Released for tender'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const rejectPreTenderDal = async (req: Request) => {
	const { reference_no, remark }: { reference_no: string; remark: string } = req.body
	try {
		const preTenderData = await prisma.tendering_form.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
				isPartial: true,
			},
		})

		if (preTenderData?.status !== 1 && preTenderData?.status !== 69) {
			throw { error: true, message: 'Invalid status of pre tender to be rejected' }
		}

		if (preTenderData?.isPartial) {
			throw { error: true, message: 'Pre tender form is partially filled' }
		}

		// start transaction
		await prisma.$transaction(async tx => {
			await tx.da_pre_tender_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.acc_pre_tender_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_pre_tender_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.acc_pre_tender_outbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.tendering_form.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: -2,
					remark: remark as string,
				},
			})

			req.body = {
				reference_no: reference_no,
				remark: 'Pre tender rejected',
			}

			const result: any = await rejectBoqDal(req)
			if (result?.error) {
				throw { error: true, message: 'Error while rejecting BOQ' }
			}

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_ACC),
					title: 'Pre-tendering form rejected',
					destination: 32,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `There is a pre-tendering form rejected. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Released for tender'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const returnToAccPtDal = async (req: Request) => {
	const { reference_no, remark }: { reference_no: string; remark: string } = req.body
	try {
		const preTenderData = await prisma.tendering_form.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				status: true,
				isPartial: true,
			},
		})

		if (preTenderData?.status !== 1 && preTenderData?.status !== 69) {
			throw { error: true, message: 'Invalid status of pre tender to be rejected' }
		}

		if (preTenderData?.isPartial) {
			throw { error: true, message: 'Pre tender form is partially filled' }
		}

		// start transaction
		await prisma.$transaction(async tx => {
			await tx.da_pre_tender_inbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.acc_pre_tender_inbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.da_pre_tender_outbox.create({
				data: {
					reference_no: reference_no,
				},
			})

			await tx.acc_pre_tender_outbox.delete({
				where: {
					reference_no: reference_no,
				},
			})

			await tx.tendering_form.update({
				where: {
					reference_no: reference_no,
				},
				data: {
					status: -1,
					remark: remark as string,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_ACC),
					title: 'Pre-tendering form returned',
					destination: 32,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: `There is a pre-tendering form returned from DA. Reference Number : ${reference_no}`,
				},
			})
		})

		return 'Returned to accountant'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

//new flow with level 1 ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

export const forwardToLevel1Dal = async (req: Request) => {
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

		if (boq?.status !== 0) {
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

		if (preTender?.status !== 0 && preTender?.isPartial === false) {
			throw {
				error: true,
				message: `Reference no. : ${reference_no} is not valid Pre tender form to be forwarded.`,
			}
		}

		//start transaction
		// await prisma.$transaction(async tx => {
		// 	await tx.da_boq_inbox.delete({
		// 		where: {
		// 			reference_no: reference_no,
		// 		},
		// 	})

		// 	await tx.da_boq_outbox.create({
		// 		data: {
		// 			reference_no: reference_no,
		// 		},
		// 	})

		// 	await tx.level1_inbox.create({
		// 		data: {
		// 			reference_no: reference_no,
		// 		},
		// 	})

		// 	await tx.boq.update({
		// 		where: {
		// 			reference_no: reference_no,
		// 		},
		// 		data: {
		// 			status: 1,
		// 		},
		// 	})

		// 	await tx.tendering_form.update({
		// 		where: {
		// 			reference_no: reference_no,
		// 		},
		// 		data: {
		// 			status: 1,
		// 		},
		// 	})

		// 	await tx.notification.create({
		// 		data: {
		// 			role_id: Number(process.env.ROLE_LEVEL1),
		// 			title: 'BOQ and Pre tender form to be reviewed',
		// 			destination: 21,
		// 			description: `There is a BOQ and Pre tender form to be reviewed. Reference Number : ${reference_no}`,
		// 		},
		// 	})
		// })

		return 'Forwarded to level 1'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

//new flow with level 1 ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import generateStockHandoverNumber from '../../lib/stockHandoverNumberGenerator'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'
import { extractRoleName } from '../../lib/roleNameExtractor'

const prisma = new PrismaClient()

export const createStockRequestDal = async (req: Request) => {
	const { inventory, emp_id, emp_name, allotted_quantity, auth } = req.body

	const ulb_id = auth?.ulb_id

	try {
		if (!ulb_id) {
			throw { error: true, message: 'ULB id is not valid' }
		}

		// const invData = await prisma.inventory.findFirst({
		// 	where: {
		// 		id: inventory,
		// 	},
		// 	select: {
		// 		quantity: true,
		// 	},
		// })

		// const invBuffer: any = await prisma.inventory_buffer.aggregate({
		// 	where: {
		// 		inventoryId: inventory,
		// 	},
		// 	_sum: {
		// 		reserved_quantity: true,
		// 	},
		// })

		// if (Number(allotted_quantity) > (Number(invData?.quantity) - invBuffer?._sum?.reserved_quantity || 0)) {
		// 	throw { error: true, message: `Allotted quantity cannot be more than the available stock. Available stock : ${Number(invData?.quantity) - invBuffer?._sum?.reserved_quantity || 0} ` }
		// }

		const stock_handover_no = generateStockHandoverNumber(ulb_id)

		const data: any = {
			// ...(category && { category: { connect: { id: category } } }),
			// subcategory: { connect: { id: subcategory } },
			// brand: { connect: { id: brand } },
			// ...(unit && { unit: { connect: { id: unit } } }),
			inventory: { connect: { id: inventory } },
			emp_id: emp_id,
			emp_name: emp_name,
			stock_handover_no: stock_handover_no,
			allotted_quantity: Number(allotted_quantity),
			ulb_id: ulb_id,
			status: 0,
		}

		let stockReq: any

		//start transaction
		await prisma.$transaction(async tx => {
			stockReq = await tx.stock_request.create({
				data: data,
			})

			await tx.dist_stock_req_inbox.create({
				data: {
					stock_handover_no: stock_handover_no,
				},
			})

			// await tx.inventory_buffer.create({
			// 	data: {
			// 		stock_handover_no: stock_handover_no,
			// 		reserved_quantity: allotted_quantity,
			// 		inventory: { connect: { id: inventory } },
			// 	},
			// })
		})

		return stockReq
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const getStockReqInboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.dist_stock_req_inboxWhereInput = {}
	const ulb_id = req?.body?.auth?.ulb_id

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
				stock_request: {
					inventory: {
						description: {
							contains: search,
							mode: 'insensitive',
						},
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
						stock_request: {
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
						stock_request: {
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
						stock_request: {
							status: {
								in: status.map(Number),
							},
						},
					},
				]
				: []),
			{
				stock_request: {
					ulb_id: ulb_id,
					status: {
						not: 61, 
					},
				}
			}
		]
	} else {
		whereClause.AND = [
			{
				stock_request: {
					ulb_id: ulb_id,
					status: {
						not: 61, 
					},
				}
			}
		]
	}

	try {
		count = await prisma.dist_stock_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.dist_stock_req_inbox.findMany({
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
								description: true,
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
	const whereClause: Prisma.dist_stock_req_outboxWhereInput = {}
	const ulb_id = req?.body?.auth?.ulb_id

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
				stock_request: {
					inventory: {
						description: {
							contains: search,
							mode: 'insensitive',
						},
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
						stock_request: {
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
						stock_request: {
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
						stock_request: {
							status: {
								in: status.map(Number),
							},
						},
					},
				]
				: []),
			{
				stock_request: {
					ulb_id: ulb_id
				}
			}
		]
	} else {
		whereClause.AND = [
			{
				stock_request: {
					ulb_id: ulb_id
				}
			}
		]
	}

	try {
		count = await prisma.dist_stock_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.dist_stock_req_outbox.findMany({
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

export const forwardToDaDal = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string[] } = req.body
	const ulb_id = req?.body?.auth?.ulb_id

	try {
		await Promise.all(
			stock_handover_no.map(async (item: string) => {
				// Fetch the status of the stock request
				const status: any = await prisma.stock_request.findFirst({
					where: {
						stock_handover_no: item,
					},
					select: {
						status: true,
					},
				})
				if (status?.status < -1 || status?.status > 0) {
					throw { error: true, message: 'Stock request is not valid to be forwarded' }
				}

				// Determine the status to update based on the current status
				const statusChecker = (status: number) => {
					if (status === 0) {
						return 2
					} else {
						return 1
					}
				}
				const statusToUpdate = statusChecker(Number(status?.status))

				// Check if the stock_handover_no already exists in the da_stock_req_inbox table
				const existingInbox = await prisma.da_stock_req_inbox.findFirst({
					where: {
						stock_handover_no: item,
					},
				})

				// Only proceed if the stock_handover_no doesn't already exist in the da_stock_req_inbox
				if (!existingInbox) {
					const daOutboxCount: number = await prisma.da_stock_req_outbox.count({
						where: {
							stock_handover_no: item,
						},
					})

					// Perform the transaction to forward the request
					await prisma.$transaction([
						// Create a new entry in dist_stock_req_outbox table
						prisma.dist_stock_req_outbox.create({
							data: { stock_handover_no: item },
						}),

						// Create a new entry in da_stock_req_inbox table
						prisma.da_stock_req_inbox.create({
							data: { stock_handover_no: item },
						}),

						// Update the stock request status
						prisma.stock_request.update({
							where: {
								stock_handover_no: item,
							},
							data: {
								status: statusToUpdate,
								remark: '',
							},
						}),

						// Delete the entry from dist_stock_req_inbox table
						prisma.dist_stock_req_inbox.delete({
							where: {
								stock_handover_no: item,
							},
						}),

						// If there is a record in da_stock_req_outbox, delete it
						...(daOutboxCount !== 0
							? [
								prisma.da_stock_req_outbox.delete({
									where: {
										stock_handover_no: item,
									},
								}),
							]
							: []),

						// Create a notification for the DA role
						prisma.notification.create({
							data: {
								role_id: Number(process.env.ROLE_DA),
								title: 'New stock request',
								destination: 25,
								from: await extractRoleName(Number(process.env.ROLE_DIST)),
								description: `There is a new stock request to be reviewed  : ${item}`,
								ulb_id
							},
						}),
					])
				} else {
					// Log if stock_handover_no already exists in da_stock_req_inbox
					console.log(`Stock handover ${item} already exists in DA inbox.`);
				}
			})
		)
		return 'Forwarded'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}


export const handoverDal = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string } = req.body;
  
	try {
	  // Check the current status of the stock request
	  const status: any = await prisma.stock_request.findFirst({
		where: {
		  stock_handover_no: stock_handover_no,
		},
		select: {
		  status: true,
		},
	  });
  
	  if (status?.status < 3) {
		throw { error: true, message: 'Stock request is not valid to be handed over' };
	  }
  
	  await prisma.$transaction(async (tx) => {
		// Update the stock request status
		await tx.stock_request.update({
		  where: {
			stock_handover_no: stock_handover_no,
		  },
		  data: {
			status: 4,
		  },
		});
  
		// Delete from dist_stock_req_inbox
		await tx.dist_stock_req_inbox.delete({
		  where: {
			stock_handover_no: stock_handover_no,
		  },
		});
  
		// Check if the stock_handover_no already exists in dist_stock_req_outbox
		const existingRecord = await tx.dist_stock_req_outbox.findUnique({
		  where: {
			stock_handover_no: stock_handover_no,
		  },
		});
  
		if (existingRecord) {
		  // If the record already exists, update it
		  await tx.dist_stock_req_outbox.update({
			where: { stock_handover_no: stock_handover_no },
			data: {
			  // Update any fields you want to modify
			  stock_handover_no: stock_handover_no, // keep the same value or change if needed
			  updatedAt: new Date(), // Example: update the timestamp
			  // Add other fields that need updating, for example:
			  // someOtherField: newValue
			},
		  });
		} else {
		  // If the record does not exist, insert a new record
		  await tx.dist_stock_req_outbox.create({
			data: {
			  stock_handover_no: stock_handover_no,
			  // Add any other data fields if required
			},
		  });
		}
	  });
  
	  return 'Handed over';
	} catch (err: any) {
	  console.log(err);
	  return { error: true, message: getErrorMessage(err) };
	}
  };
  
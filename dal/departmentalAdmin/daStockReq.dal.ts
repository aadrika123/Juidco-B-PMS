import { Request } from 'express'
import { PrismaClient, Prisma } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'
import { extractRoleName } from '../../lib/roleNameExtractor'

const prisma = new PrismaClient()

export const getStockReqInboxDal = async (req: Request) => {
	console.log("here data is availabel for stockreq")
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.da_stock_req_inboxWhereInput = {}
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
					emp_id: {
						contains: search,
						mode: 'insensitive',
					},
				}
			},
			{
				stock_request: {
					emp_name: {
						contains: search,
						mode: 'insensitive',
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
						// stock_request: {
						// 	category_masterId: {
						// 		in: category,
						// 	},
						// },
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
						// stock_request: {
						// 	subcategory_masterId: {
						// 		in: subcategory,
						// 	},
						// },
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
							}
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
		count = await prisma.da_stock_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.da_stock_req_inbox.findMany({
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

export const getStockReqOutboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.da_stock_req_outboxWhereInput = {}
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
					emp_id: {
						contains: search,
						mode: 'insensitive',
					},
				}
			},
			{
				stock_request: {
					emp_name: {
						contains: search,
						mode: 'insensitive',
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
						// stock_request: {
						// 	category_masterId: {
						// 		in: category,
						// 	},
						// },
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
						// stock_request: {
						// 	subcategory_masterId: {
						// 		in: subcategory,
						// 	},
						// },
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
							}
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
		count = await prisma.da_stock_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.da_stock_req_outbox.findMany({
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

export const forwardToIaDal = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string[] } = req.body
	const ulb_id = req?.body?.auth?.ulb_id

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

				if (stockReq?.status < -1|| stockReq?.status == 0  || stockReq?.status > 2) {
					throw { error: true, message: 'Stock request is not valid to be forwarded' }
				}
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
					prisma.da_stock_req_inbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					// prisma.dist_stock_req_outbox.delete({
					// 	where: {
					// 		stock_handover_no: item,
					// 	},
					// }),
					prisma.stock_request.update({
						where: {
							stock_handover_no: item,
						},
						data: {
							status: 80,
							remark: '',
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
							role_id: Number(process.env.ROLE_IA),
							title: 'New stock request',
							destination: 80,
							from: await extractRoleName(Number(process.env.ROLE_DA)),
							description: `There is a new stock request to be reviewed  : ${item}`,
							ulb_id
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


export const forwardToIaDeadDal = async (req: Request) => {

	const { stock_handover_no, service_no, inventoryId }: { 
	  stock_handover_no: string[], 
	  service_no: string[], 
	  inventoryId: string | any 
	} = req.body;
	
	const ulb_id = req?.body?.auth?.ulb_id;
  
	if (!stock_handover_no || stock_handover_no.length === 0) {
	  return { error: true, message: 'No stock_handover_no provided.' };
	}
	
	try {
	  await Promise.all(
		stock_handover_no.map(async (item: string) => {
		  // Fetch the stock request by stock_handover_no
		  let stockReq = await prisma.service_request.findFirst({
			where: { stock_handover_no: item },
			select: { status: true, stock_handover_no: true, service_no: true },
		  });

  
		  if (!stockReq) {
			console.log(`No service request found for stock_handover_no: ${item}. Creating a new record.`);

			stockReq = await prisma.service_request.create({
			  data: {
				stock_handover_no: item,
				service_no: service_no[0], 
				status: 0,  
				remark: '',
				service: 'dead',  
				inventoryId: String(inventoryId),  
			  },
			});
  
		  }

		  const iaOutboxCount: number = await prisma.ia_stock_req_outbox.count({
			where: { stock_handover_no: item },
		  });
  
		  await prisma.$transaction([
			prisma.da_stock_req_outbox.create({
			  data: { stock_handover_no: item },
			}),
			prisma.ia_service_req_inbox.create({
				data: { service_no: service_no[0] },
			  }),
  
			prisma.ia_stock_req_inbox.create({
			  data: { stock_handover_no: item },
			}),
  
			prisma.da_stock_req_inbox.delete({
			  where: { stock_handover_no: item },
			}),
  
			prisma.service_request.update({
			  where: { stock_handover_no: stockReq.stock_handover_no, service_no: stockReq.service_no },
			  data: {
				status: 20,  // Set status to "IA"
				remark: '',
			  },
			}),
  
			...(iaOutboxCount !== 0
			  ? [
				  prisma.ia_stock_req_outbox.delete({
					where: { stock_handover_no: item },
				  }),
				]
			  : []),

			prisma.notification.create({
			  data: {
				role_id: Number(process.env.ROLE_IA),  
				title: 'New stock request',
				destination: 80,  
				from: await extractRoleName(Number(process.env.ROLE_DA)),  
				description: `There is a new stock request to be reviewed: ${item}`, 
				ulb_id,  
			  },
			}),
		  ]);
		})
	  );
  
	  return 'Forwarded';
	} catch (err: any) {
	  console.log(err);
	  return { error: true, message: getErrorMessage(err) };
	}
  };
  
  

export const returnStockReqDal = async (req: Request) => {
	const { stock_handover_no, remark }: { stock_handover_no: string[]; remark: string } = req.body
	const ulb_id = req?.body?.auth?.ulb_id

	try {
		await Promise.all(
			stock_handover_no.map(async (item: string) => {
				const status: any = await prisma.stock_request.findFirst({
					where: {
						stock_handover_no: item,
					},
					select: {
						status: true,
					},
				})
				if (status?.status < 1 || status?.status > 2) {
					throw { error: true, message: 'Stock request is not valid to be returned' }
				}

				await prisma.$transaction([
					prisma.da_stock_req_outbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.dist_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.stock_request.update({
						where: {
							stock_handover_no: item,
						},
						data: {
							status: -1,
							remark: remark,
						},
					}),
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
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DIST),
							title: 'Stock returned',
							destination: 40,
							from: await extractRoleName(Number(process.env.ROLE_DA)),
							description: `stock request : ${item} has been returned`,
							ulb_id
						},
					}),
				])
			})
		)
		return 'Returned'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const rejectStockReqDal = async (req: Request) => {
	const { stock_handover_no, remark }: { stock_handover_no: string[]; remark: string } = req.body
	const ulb_id = req?.body?.auth?.ulb_id

	try {
		await Promise.all(
			stock_handover_no.map(async (item: string) => {
				const status: any = await prisma.stock_request.findFirst({
					where: {
						stock_handover_no: item,
					},
					select: {
						status: true,
					},
				})
				if (status?.status < 1 || status?.status > 2) {
					throw { error: true, message: 'Stock request is not valid to be rejected' }
				}

				await prisma.$transaction([
					prisma.da_stock_req_outbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.dist_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.stock_request.update({
						where: {
							stock_handover_no: item,
						},
						data: {
							status: -2,
							remark: remark,
						},
					}),
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
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DIST),
							title: 'Stock request rejected',
							destination: 40,
							from: await extractRoleName(Number(process.env.ROLE_DA)),
							description: `stock request : ${item} has been rejected`,
							ulb_id
						},
					}),
				])
			})
		)
		return 'Rejected'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const procurementApprovalDal = async (req: Request) => {
	const { stock_handover_no, approve }: { stock_handover_no: string, approve: boolean } = req.body
	const ulb_id = req?.body?.auth?.ulb_id

	try {

		await prisma.$transaction(async tx => {
			await tx.stock_request.update({
				where: {
					stock_handover_no: stock_handover_no
				},
				data: {
					is_notified: approve ? 2 : -2  //allowed or not allowed
				}
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_IA),
					title: approve ? 'Proceed for procurement' : 'Do not proceed for procurement',
					destination: 0,
					from: await extractRoleName(Number(process.env.ROLE_DA)),
					description: ` Stock request : ${stock_handover_no} has ${!approve && 'no'} consent for procurement`,
					ulb_id
				},
			})
		})

		return approve ? 'Approved' : 'Rejected'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}
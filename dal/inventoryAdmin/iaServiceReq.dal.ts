/*
Author - Anil Tigga
Status - Open
*/

import { Request } from 'express'
import { PrismaClient, Prisma, service_request, service_enum } from '@prisma/client'
import { serviceTranslator } from '../distributor/distServiceReq.dal'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'
import { imageUploaderV2 } from '../../lib/imageUploaderV2'
import { extractRoleName } from '../../lib/roleNameExtractor'
import generateServiceNumber from '../../lib/serviceNumberGenerator'

const prisma = new PrismaClient()

type reqType = {
	products: productType[]
	service: service_enum
	stock_handover_no: string
	inventoryId: string
	auth: any
}

type productType = {
	serial_no: string
}

export const getServiceReqInboxDal = async (req: Request) => {
	console.log("ia data here")
	const page: number | undefined = Number(req?.query?.page)
	// const take: number | undefined = Number(req?.query?.take)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.ia_service_req_inboxWhereInput = {}
	const ulb_id = req?.body?.auth?.ulb_id

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]
	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
	const service: any[] = Array.isArray(req?.query?.service) ? req?.query?.service : [req?.query?.service]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				service_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				service_req: {
					stock_handover_no: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	if (category[0] || subcategory[0] || brand[0] || status[0] || service[0]) {
		whereClause.AND = [
			...(service[0]
				? [
					{
						service_req: {
							service: {
								in: service,
							},
						},
					},
				]
				: []),
			...(category[0]
				? [
					{
						service_req: {
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
						service_req: {
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
						service_req: {
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
						service_req: {
							status: {
								in: status.map(Number),
							},
						},
					},
				]
				: []),
			{
				service_req: {
					ulb_id: ulb_id
				}
			}
		]
	} else {
		whereClause.AND = [
			{
				service_req: {
					ulb_id: ulb_id
				}
			}
		]
	}

	try {
		count = await prisma.ia_service_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.ia_service_req_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				service_no: true,
				service_req: {
					select: {
						stock_handover_no: true,
						service: true,
						remark: true,
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
						status: true,
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.service_req }
			delete item.service_req
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

export const getServiceReqOutboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.ia_service_req_outboxWhereInput = {}
	const ulb_id = req?.body?.auth?.ulb_id

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
	const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]
	const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
	const service: any[] = Array.isArray(req?.query?.service) ? req?.query?.service : [req?.query?.service]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				service_no: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				service_req: {
					stock_handover_no: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		]
	}

	if (category[0] || subcategory[0] || brand[0] || status[0] || service[0]) {
		whereClause.AND = [
			...(service[0]
				? [
					{
						service_req: {
							service: {
								in: service,
							},
						},
					},
				]
				: []),
			...(category[0]
				? [
					{
						service_req: {
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
						service_req: {
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
						service_req: {
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
						service_req: {
							status: {
								in: status.map(Number),
							},
						},
					},
				]
				: []),
			{
				service_req: {
					ulb_id: ulb_id
				}
			}
		]
	} else {
		whereClause.AND = [
			{
				service_req: {
					ulb_id: ulb_id
				}
			}
		]
	}

	try {
		count = await prisma.ia_service_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.ia_service_req_outbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				service_no: true,
				service_req: {
					select: {
						stock_handover_no: true,
						service: true,
						remark: true,
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
						status: true,
					},
				},
			},
		})

		let resultToSend: any[] = []

		result.map(async (item: any) => {
			const temp = { ...item?.service_req }
			delete item.service_req
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

export const approveServiceRequestDal = async (req: Request) => {
	const { service_no, remark }: { service_no: string; remark: string } = req.body
	const doc = req.files
	const formattedAuth = typeof req?.body?.auth !== 'string' ? JSON.stringify(req?.body?.auth) : req.body?.auth
	const ulb_id = JSON.parse(formattedAuth)?.ulb_id

	try {
		const serviceReq = await prisma.service_request.findFirst({
			where: {
				service_no: service_no,
			},
			select: {
				service_no: true,
				stock_handover_no: true,
				stock_request: {
					select: {
						emp_id: true
					}
				},
				status: true,
				service: true,
				inventory: {
					select: {
						subcategory: {
							select: {
								name: true,
							},
						},
					},
				},
				service_req_product: true,
			},
		})

		console.log("serviceReqserviceReqserviceReq",serviceReq?.stock_handover_no)
		if (serviceReq?.service === 'dead' && doc?.length === 0) {
			throw { error: true, message: 'For dead stock request, document is mandatory' }
		}

		if (serviceReq?.status !== 20) {
			throw { error: true, message: 'Invalid status of service request to be approved' }
		}

		const serviceReqProd = await prisma.service_req_product.findMany({
			where: {
				service_no: service_no,
			},
		})

		const handoverData = await prisma.dist_stock_req_inbox.findFirst({
			where :{
				stock_handover_no:serviceReq?.stock_handover_no
			}
		})

		const distOutbox = await prisma.dist_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		const daOutbox = await prisma.da_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		//start transaction
		await prisma.$transaction(async tx => {
			if (serviceReq?.service === 'dead') {
				await Promise.all(
					serviceReqProd.map(async prod => {
						await addToDeadStock(prod?.serial_no, prod.quantity, remark, doc, String(serviceReq?.inventory?.subcategory?.name), tx, serviceReq?.service_no, serviceReq?.stock_handover_no)
					})
				)
			}

			if (serviceReq?.service === 'warranty') {
				await Promise.all(
					serviceReqProd.map(async prod => {
						await warrantyClaim(prod?.serial_no, remark, String(serviceReq?.inventory?.subcategory?.name), tx, serviceReq?.service_no, serviceReq?.stock_handover_no)
					})
				)
			}

			if (serviceReq?.service === 'return') {
				await Promise.all(
					serviceReqProd.map(async prod => {
						await returnToInventory(prod?.serial_no, prod.quantity, String(serviceReq?.inventory?.subcategory?.name), tx, serviceReq?.service_no, serviceReq?.stock_handover_no, serviceReq?.stock_request?.emp_id)
					})
				)
			}

			await tx.ia_service_req_inbox.delete({
				where: {
					service_no: service_no,
				},
			})

			await tx.ia_service_req_outbox.create({
				data: {
					service_no: service_no,
				},
			})

			if(handoverData == null){
				await tx.dist_stock_req_inbox.create({
					data: {
						stock_handover_no: serviceReq?.stock_handover_no,
					},
				})
			}
			

			// Check if record exists in dist_service_req_inbox
			const existingInboxEntry = await tx.dist_service_req_inbox.findUnique({
				where: {
					service_no: service_no,
				},
			})

			if (!existingInboxEntry) {
				// Only insert if not already existing
				await tx.dist_service_req_inbox.create({
					data: {
						service_no: service_no,
					},
				})
			} else {
				console.log(`Service number ${service_no} already exists in dist_service_req_inbox. Skipping insert.`);
			}

			// Check if service_no exists in dist_service_req_outbox
			if (distOutbox > 0) {
				await tx.dist_service_req_outbox.delete({
					where: {
						service_no: service_no,
					},
				})
			}

			// Check if record exists in da_service_req_outbox before insertion
			const existingDaOutboxEntry = await tx.da_service_req_outbox.findUnique({
				where: {
					service_no: service_no,
				},
			})

			if (existingDaOutboxEntry !== null) {
				await tx.da_service_req_outbox.create({
					data: {
						service_no: service_no,
					},
				})
			} else {
				console.log(`Service number ${service_no} already exists in da_service_req_outbox. Skipping insert.`);
			}

			// Handle DA inbox and outbox based on service type
			if (serviceReq?.service !== 'return') {
				await tx.da_service_req_inbox.create({
					data: {
						service_no: service_no,
					},
				})
			} else {
				console.log("service_noservice_no",service_no,existingDaOutboxEntry)
				// if(existingDaOutboxEntry !== null){

				
				await tx.da_service_req_inbox.delete({
					where: {
						service_no: service_no,
					},
				})
				await tx.da_service_req_outbox.create({
					data: {
						service_no: service_no,
					},
				})
			// }
			}

			// Deleting from da_service_req_outbox if necessary
			if (daOutbox > 0) {
				await tx.da_service_req_outbox.delete({
					where: {
						service_no: service_no,
					},
				})
			}

			await tx.service_request.update({
				where: {
					service_no: service_no,
				},
				data: {
					status: 23,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DIST),
					title: 'Service request approved',
					destination: 41,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: `${serviceTranslator(serviceReq?.service)} approved. Service Number : ${service_no}`,
					ulb_id
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'Service request approved',
					destination: 26,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: `${serviceTranslator(serviceReq?.service)} approved. Service Number : ${service_no}`,
					ulb_id
				},
			})
		})

		return 'Approved by IA'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}


export const rejectServiceRequestDal = async (req: Request) => {
	const { service_no, remark }: { service_no: string, remark: string } = req.body;
	const ulb_id = req?.body?.auth?.ulb_id;
  
	try {
  
	  if (!service_no && !remark) {
		throw { error: true, message: 'Both service number and remark are required' };
	  }
  
	  const serviceReq = await prisma.service_request.findFirst({
		where: {
		  service_no: service_no,
		},
		select: {
		  status: true,
		  service: true,
		},
	  });
  
	  if (serviceReq?.status !== 20) {
		throw { error: true, message: 'Invalid status of service request to be rejected' };
	  }
  
	  const distOutbox = await prisma.dist_service_req_outbox.count({
		where: {
		  service_no: service_no,
		},
	  });
  
	  const daOutbox = await prisma.da_service_req_outbox.count({
		where: {
		  service_no: service_no,
		},
	  });
  
	  // Start transaction
	  await prisma.$transaction(async tx => {
		
		// Delete from IA Service Request Inbox
		await tx.ia_service_req_inbox.delete({
		  where: {
			service_no: service_no,
		  },
		});
  
		// Create new IA Service Request Outbox
		await tx.ia_service_req_outbox.create({
		  data: {
			service_no: service_no,
		  },
		});
  
		// Create new Dist Service Request Inbox if it doesn't exist
		const distInboxExists = await tx.dist_service_req_inbox.findUnique({
		  where: {
			service_no: service_no,
		  },
		});
  
		if (!distInboxExists) {
		  await tx.dist_service_req_inbox.create({
			data: {
			  service_no: service_no,
			},
		  });
		}
		const data = await tx.da_service_req_inbox.findFirst({
			where: {
			  service_no: service_no,
			} 
		})

		const datas = await tx.da_service_req_outbox.findFirst({
			where: {
			  service_no: service_no,
			} 
		})
		console.log("datadata",datas)
  
		// Handle DA Service Request Inbox or Outbox
		if (serviceReq?.service !== 'return') {
		  await tx.da_service_req_inbox.create({
			data: {
			  service_no: service_no,
			},
		  });
		} else {
			if(data !==null){
				await tx.da_service_req_inbox.delete({
					where: {
					  service_no: service_no,
					},
				  });
			}
			if(datas ==null){
		  await tx.da_service_req_outbox.create({
			data: {
			  service_no: service_no,
			},
		  });
		}
		}
  
		// Delete from Dist Service Request Outbox if exists
		if (distOutbox > 0) {
		  await tx.dist_service_req_outbox.delete({
			where: {
			  service_no: service_no,
			},
		  });
		}
  
		// Update service request status and add remark
		await tx.service_request.update({
		  where: {
			service_no: service_no,
		  },
		  data: {
			status: 12,
			remark: remark as string,
		  },
		});
  
		// Create notifications
		await tx.notification.create({
		  data: {
			role_id: Number(process.env.ROLE_DIST),
			title: 'Service request rejected',
			destination: 41,
			from: await extractRoleName(Number(process.env.ROLE_IA)),
			description: `${serviceTranslator(serviceReq?.service)} rejected. Service Number : ${service_no}`,
			ulb_id,
		  },
		});
  
		await tx.notification.create({
		  data: {
			role_id: Number(process.env.ROLE_DA),
			title: 'Service request rejected',
			destination: 26,
			from: await extractRoleName(Number(process.env.ROLE_IA)),
			description: `${serviceTranslator(serviceReq?.service)} rejected. Service Number : ${service_no}`,
			ulb_id,
		  },
		});
	  });
  
	  return 'Rejected by DA';
	} catch (err: any) {
	  console.log(err);
	  return { error: true, message: err?.message };
	}
  };
  

export const returnServiceRequestDal = async (req: Request) => {
	const { service_no }: { service_no: string } = req.body
	const ulb_id = req?.body?.auth?.ulb_id

	try {
		const serviceReq = await prisma.service_request.findFirst({
			where: {
				service_no: service_no,
			},
			select: {
				status: true,
				service: true,
			},
		})

		if (!serviceReq) {
			throw { error: true, message: 'Invalid service number' }
		}

		if (serviceReq?.status !== 20) {
			throw { error: true, message: 'Invalid status of service request to be returned' }
		}

		const distOutbox = await prisma.dist_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		const daOutbox = await prisma.da_service_req_outbox.count({
			where: {
				service_no: service_no,
			},
		})

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.ia_service_req_inbox.delete({
				where: {
					service_no: service_no,
				},
			})

			await tx.ia_service_req_outbox.create({
				data: {
					service_no: service_no,
				},
			})

			await tx.dist_service_req_inbox.create({
				data: {
					service_no: service_no,
				},
			})

			if (distOutbox > 0) {
				await tx.dist_service_req_outbox.delete({
					where: {
						service_no: service_no,
					},
				})
			}

			await tx.da_service_req_inbox.create({
				data: {
					service_no: service_no,
				},
			})

			if (daOutbox > 0) {
				await tx.da_service_req_outbox.delete({
					where: {
						service_no: service_no,
					},
				})
			}

			await tx.service_request.update({
				where: {
					service_no: service_no,
				},
				data: {
					status: 11,
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DIST),
					title: 'Service request returned from IA',
					destination: 41,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: `${serviceTranslator(serviceReq?.service)} returned from IA. Service Number : ${service_no}`,
					ulb_id
				},
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'Service request returned from IA',
					destination: 26,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: `${serviceTranslator(serviceReq?.service)} returned from IA. Service Number : ${service_no}`,
					ulb_id
				},
			})
		})

		return 'returned from IA'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

const addToDeadStock = async (
	serial_no: string, 
	quantity: number, 
	remark: string, 
	doc: any, 
	subcategory_name: string, 
	tx: Prisma.TransactionClient, 
	service_no?: string, 
	stock_handover_no?: string
  ) => {
	console.log("serial_no:", serial_no);

	const sanitizedSubcategoryName = subcategory_name.toLowerCase().replace(/\s/g, '');
  
	const product = await prisma
	  .$queryRawUnsafe(
		`
		  SELECT *
		  FROM product.product_${sanitizedSubcategoryName}
		  WHERE serial_no = '${serial_no}'
		`
	  )
	  .then((result: any) => result[0]);

  
	if ((Number(product?.opening_quantity) - quantity) < 0) {
	  throw new Error('No more quantity available');
	}
  
	await tx.$queryRawUnsafe(`
	  UPDATE product.product_${sanitizedSubcategoryName}
	  SET is_available = false, 
		  is_dead = true, 
		  quantity = ${Number(product?.opening_quantity) - quantity}, 
		  opening_quantity = ${Number(product?.opening_quantity) - quantity}
	  WHERE serial_no = '${serial_no}'
	`);
  
	await tx.inventory.update({
	  where: {
		id: product?.inventory_id,
	  },
	  data: {
		quantity: {
		  decrement: quantity,
		},
	  },
	});
  
	const invDeadStock = await tx.inventory_dead_stock.create({
	  data: {
		inventoryId: product?.inventory_id,
		serial_no: product?.serial_no,
		quantity: quantity,
		remark2: remark,
	  },
	});

	const uploaded = await imageUploaderV2(doc);
	
	await Promise.all(
	  uploaded.map(async (item) => {
		await tx.inventory_dead_stock_image.create({
		  data: {
			doc_path: item,
			uploader: 'IA',
			inventory_dead_stockId: invDeadStock?.id,
		  },
		});
	  })
	);
  
	if (stock_handover_no && service_no) {
	  await tx.service_history.create({
		data: {
		  stock_handover_no: stock_handover_no,
		  service_no: service_no,
		  serial_no: serial_no,
		  quantity: quantity,
		  service: 'dead',
		  inventoryId: product?.inventory_id,
		},
	  });
	}
  };
  

const warrantyClaim = async (serial_no: string, remark: string, subcategory_name: string, tx: Prisma.TransactionClient, service_no?: string, stock_handover_no?: string) => {
	console.log("subcategory_namesubcategory_name",subcategory_name)
	const product = await prisma
		.$queryRawUnsafe(
			`
					SELECT *
					FROM product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
					WHERE serial_no = '${serial_no as string}'
				`
		)
		.then((result: any) => result[0])


	const inv = await prisma.inventory.findFirst({
		where: {
			id: product?.inventory_id,
		},
		select: {
			warranty: true,
			quantity: true
		},
	})

	if (Number(!inv?.warranty)) {
		throw { error: true, message: 'No warranty for the selected item' }
	}

	if (!product?.quantity) {
		throw { error: true, message: 'No item avalable' }
	}

	await tx.inventory_warranty.create({
		data: {
			inventoryId: product?.inventory_id,
			serial_no: product?.serial_no,
			quantity: product?.quantity,
			remark2: remark,
		},
	})

	if (stock_handover_no && service_no) {
		await tx.stock_req_product.update({
			where: {
				stock_handover_no_serial_no: {
					stock_handover_no: stock_handover_no,
					serial_no: product?.serial_no
				}
			},
			data: {
				is_available: true
			},
		})


		await tx.service_history.create({
			data: {
				stock_handover_no: stock_handover_no,
				service_no: service_no,
				serial_no: serial_no,
				service: 'warranty',
				// inventory: { connect: { id: product?.inventory_id } },
				inventoryId: product?.inventory_id,
			},
		})
	}
}

const returnToInventory = async (serial_no: string, quantity: number, subcategory_name: string, tx: Prisma.TransactionClient, service_no: string, stock_handover_no: string, emp_id: string) => {
	const product = await prisma
		.$queryRawUnsafe(
			`
					SELECT *
					FROM product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
					WHERE serial_no = '${serial_no as string}'
				`
		)
		.then((result: any) => result[0])

	await tx.$queryRawUnsafe(`
			UPDATE product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
			SET is_available = true, quantity=${product?.quantity + quantity}
			WHERE serial_no = '${serial_no as string}'
		`)

	await tx.inventory.update({
		where: {
			id: product?.inventory_id,
		},
		data: {
			quantity: {
				increment: quantity,
			},
		},
	})

	await tx.stock_handover.update({
		where: {
			emp_id_serial_no: {
				emp_id: emp_id,
				serial_no: serial_no
			}
		},
		data: {
			return_date: new Date(),
			is_alloted: false
		}
	})

	await tx.service_history.create({
		data: {
			stock_handover_no: stock_handover_no,
			service_no: service_no,
			serial_no: serial_no,
			quantity: quantity,
			service: 'return',
			// inventory: { connect: { id: product?.inventory_id } },
			inventoryId: product?.inventory_id,
		},
	})
}

// const returnToInventory = async (serial_no: string, quantity: number, subcategory_name: string, tx: Prisma.TransactionClient) => {
// 	const product = await prisma
// 		.$queryRawUnsafe(
// 			`
// 					SELECT *
// 					FROM product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
// 					WHERE serial_no = '${serial_no as string}'
// 				`
// 		)
// 		.then((result: any) => result[0])

// 	await tx.$queryRawUnsafe(`
// 			UPDATE product.product_${subcategory_name.toLowerCase().replace(/\s/g, '')}
// 			SET is_available = true,
// 			WHERE serial_no = '${serial_no as string}'
// 		`)

// 	await tx.inventory.update({
// 		where: {
// 			id: product?.inventory_id,
// 		},
// 		data: {
// 			quantity: {
// 				increment: quantity,
// 			},
// 		},
// 	})
// }


export const createServiceRequestByIaDal = async (req: Request) => {
	const { product, quantity, service, inventoryId, remark } = req.body
	const doc = req.files

	// const formattedBody = typeof req.body !== 'string' ? JSON.stringify(req.body) : req.body
	// const ulb_id = JSON.parse(formattedBody)?.auth?.ulb_id

	try {

		if (service === 'dead' && !quantity) {
			throw new Error('Quantity is required for dead stock')
		}

		const inventoryData = await prisma.inventory.findFirst({
			where: {
				id: inventoryId
			},
			include: {
				category: true,
				subcategory: true
			}
		})

		if (!inventoryData) {
			throw new Error('No inventory data found')
		}

		// 	const productData = await prisma.$queryRawUnsafe(
		// 		`
		// 			SELECT *
		// 			FROM product.product_${inventoryData?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
		// 			WHERE inventory_id = '${inventoryId as string}'
		// `
		// 	)
		// 		.then((result: any) => result[0])


		// start transaction
		await prisma.$transaction(async tx => {
			if (inventoryData?.subcategory?.name) {
				if (service === 'dead') {
					await addToDeadStock(product, Number(quantity), remark, doc, inventoryData?.subcategory?.name, tx)
				}
				if (service === 'warranty') {
					await warrantyClaim(product, remark, inventoryData?.subcategory?.name, tx)
				}
			}
		})

		return 'Successfull'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}
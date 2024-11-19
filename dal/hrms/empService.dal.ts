import { Request } from 'express'
import { emp_service_request, Prisma, PrismaClient, service_enum } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'
import generateEmpServiceNumber from '../../lib/empServiceNumberGenerator'
import { extractRoleName } from '../../lib/roleNameExtractor'

const prisma = new PrismaClient()



type reqType = {
	products: string[]
	service: service_enum
	stock_handover_no: string
	inventoryId: string
	auth: any
}

// type productType = {
// 	serial_no: string
// }

export const serviceTranslator = (service: service_enum): string => {
	let result: string
	switch (service) {
		case 'return':
			result = 'Employee Return Request'
			break
		case 'warranty':
			result = 'Employee Warranty Claim Request'
			break
		case 'dead':
			result = 'Employee Dead Stock Request'
			break
	}
	return result
}

export const createEmpServiceRequestDal = async (req: Request) => {
	const { products, service, stock_handover_no, inventoryId, auth }: reqType = req.body;
	const ulb_id = auth?.ulb_id;
  
	try {
	  const service_no = generateEmpServiceNumber(ulb_id);
  
	  const data: Omit<emp_service_request, 'createdAt' | 'updatedAt' | 'remark' | 'id'> = {
		service_no: service_no,
		stock_handover_no: stock_handover_no,
		service: service,
		inventoryId: inventoryId,
		user_id: auth?.id,
		status: 10,
		ulb_id: ulb_id,
	  };
  
	  let serviceReq: any;
  
	  // Start transaction
	  await prisma.$transaction(async (tx) => {
		// Create the service request record
		serviceReq = await tx.emp_service_request.create({
		  data: data,
		});
  
		// Process each product in the products array
		await Promise.all(
		  products.map(async (product) => {
			// Fetch quantity for the product based on stock_handover_no and serial_no
			const quantityForService = await prisma.stock_req_product.findFirst({
			  where: {
				stock_handover_no: stock_handover_no,
				serial_no: product,
			  },
			  select: {
				quantity: true,
			  },
			});
  
			if (!quantityForService) {
			  throw new Error(`Product with serial number ${product} not found or no quantity available.`);
			}
  
			// Check if the product already exists in the emp_service_req_product table to avoid unique constraint errors
			const existingProduct = await tx.emp_service_req_product.findFirst({
			  where: {
				serial_no: product,
				service_no: service_no, // Prevent duplicate serial_no for the same service request
			  },
			});
  
			if (existingProduct) {
			  // Log the duplicate check and skip the insertion
			  console.log(`Skipping duplicate product with serial number ${product} for service_no ${service_no}`);
			  return; // Skip inserting the duplicate product
			}
  
			// Create emp_service_req_product if it does not exist already
			if (existingProduct) {
			await tx.emp_service_req_product.create({
			  data: {
				service_no: service_no,
				serial_no: product,
				inventoryId: inventoryId,
				quantity: quantityForService?.quantity,
			  },
			});
		}else{
				// Update stock_req_product to mark it as unavailable
				await tx.stock_req_product.update({
					where: {
					  stock_handover_no_serial_no: {
						stock_handover_no: stock_handover_no,
						serial_no: product,
					  },
					},
					data: {
					  is_available: false,
					},
				  });

		}
  
		
		  })
		);
  
		// Create entries for emp_service_req_outbox and dist_emp_service_req_inbox
		await tx.emp_service_req_outbox.create({
		  data: {
			service_no: service_no,
		  },
		});
  
		await tx.dist_emp_service_req_inbox.create({
		  data: {
			service_no: service_no,
		  },
		});
  
		// Create a notification for the service request
		await tx.notification.create({
		  data: {
			role_id: Number(process.env.ROLE_DIST),
			title: 'New employee Service request',
			destination: 42,
			from: await extractRoleName(Number(process.env.ROLE_EMP)),
			description: `There is a ${serviceTranslator(service)}. Service Number : ${service_no}`,
			ulb_id,
		  },
		});
	  });
  
	  return serviceReq;
	} catch (err: any) {
	  console.error(err);
	  return { error: true, message: err?.message || 'An error occurred while processing the service request.' };
	}
  };
  
  
  
  



export const getServiceReqInboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.emp_service_req_inboxWhereInput = {}
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
				emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
							status: {
								in: status.map(Number),
							},
						},
					},
				]
				: []),
		]
	}

	whereClause.emp_service_req = {
		user_id: req?.body?.auth?.id
	}

	whereClause.emp_service_req = {
		ulb_id: ulb_id
	}

	try {
		count = await prisma.emp_service_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.emp_service_req_inbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				service_no: true,
				emp_service_req: {
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
			const temp = { ...item?.emp_service_req }
			delete item.emp_service_req
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
	const whereClause: Prisma.emp_service_req_outboxWhereInput = {}
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
				emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
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
						emp_service_req: {
							status: {
								in: status.map(Number),
							},
						},
					},
				]
				: []),
		]
	}

	whereClause.emp_service_req = {
		user_id: req?.body?.auth?.id
	}

	whereClause.emp_service_req = {
		ulb_id: ulb_id
	}

	try {
		count = await prisma.emp_service_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.emp_service_req_outbox.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				service_no: true,
				emp_service_req: {
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
			const temp = { ...item?.emp_service_req }
			delete item.emp_service_req
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
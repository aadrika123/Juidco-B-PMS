import { Request } from 'express'
import { PrismaClient, Prisma, stock_request } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'
import { extractRoleName } from '../../lib/roleNameExtractor'

const prisma = new PrismaClient()

export const getStockReqInboxDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.ia_stock_req_inboxWhereInput = {}
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

	if (category[0] || subcategory[0] || brand[0] || status[0]) {
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
		count = await prisma.ia_stock_req_inbox.count({
			where: whereClause,
		})
		const result = await prisma.ia_stock_req_inbox.findMany({
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
	const whereClause: Prisma.ia_stock_req_outboxWhereInput = {}
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

	if (category[0] || subcategory[0] || brand[0] || status[0]) {
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
		count = await prisma.ia_stock_req_outbox.count({
			where: whereClause,
		})
		const result = await prisma.ia_stock_req_outbox.findMany({
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

export const approveStockReqDal_legacy = async (req: Request) => {
	const { stock_handover_no }: { stock_handover_no: string[] } = req.body
	const ulb_id = req?.body?.auth?.ulb_id

	try {
		await Promise.all(
			stock_handover_no.map(async (item: string) => {
				const stockReq = await prisma.stock_request.findFirst({
					where: { stock_handover_no: item },
					select: {
						allotted_quantity: true,
						inventoryId: true,
						status: true,
						inventory: {
							select: {
								subcategory: {
									select: {
										name: true,
									},
								},
							},
						},
						stock_req_product: true,
					},
				})

				if (!stockReq) {
					throw { error: true, message: 'Invalid stock handover' }
				}

				if (stockReq?.status !== 1 && stockReq?.status !== 80) {
					throw { error: true, message: 'Stock request is not valid to be approved' }
				}

				const products: any[] = await prisma.$queryRawUnsafe(
					`
						SELECT *
						FROM product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
						WHERE is_available = true AND inventory_id = '${stockReq?.inventoryId as string}'
						LIMIT ${stockReq?.allotted_quantity as Number}
						`
				)

				if (products.length === 0) {
					throw { error: true, message: 'No product available' }
				}

				if (products.length !== Number(stockReq?.allotted_quantity)) {
					throw { error: true, message: 'Insufficient quantity' }
				}

				await prisma.$transaction(async tx => {
					await Promise.all(
						products.map(async product => {
							await tx.$queryRawUnsafe(`
							UPDATE product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
							SET is_available = false
							WHERE serial_no = '${product?.serial_no as string}'
						`)
							tx.stock_req_product.create({
								data: {
									stock_handover_no: item,
									serial_no: product?.serial_no as string,
									inventoryId: stockReq?.inventoryId as string,
								},
							})
						})
					)
					await tx.stock_request.update({
						where: {
							stock_handover_no: item,
						},
						data: {
							status: 3,
						},
					})
					await tx.ia_stock_req_outbox.create({
						data: { stock_handover_no: item },
					})
					await tx.dist_stock_req_inbox.create({
						data: { stock_handover_no: item },
					})
					await tx.da_stock_req_inbox.create({
						data: { stock_handover_no: item },
					})
					await tx.inventory.update({
						where: { id: stockReq?.inventoryId as string },
						data: {
							quantity: {
								decrement: Number(stockReq?.allotted_quantity),
							},
						},
					})
					await tx.ia_stock_req_inbox.delete({
						where: {
							stock_handover_no: item,
						},
					})
					await tx.dist_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					})
					await tx.da_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					})
					await tx.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DIST),
							title: 'Stock approved',
							destination: 40,
							from: await extractRoleName(Number(process.env.ROLE_IA)),
							description: `stock request : ${item} has approved`,
							ulb_id
						},
					})
					await tx.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DA),
							title: 'Stock approved',
							destination: 25,
							from: await extractRoleName(Number(process.env.ROLE_IA)),
							description: `stock request : ${item} has approved`,
							ulb_id
						},
					})
				})
			})
		)
		return 'Approved'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const approveStockReqDal = async (req: Request) => {
	const { stock_handover_no, serial_nos }: { stock_handover_no: string[], serial_nos: string[] } = req.body;
	const ulb_id = req?.body?.auth?.ulb_id;
  
	try {
	  await Promise.all(
		stock_handover_no.map(async (item: string) => {
		  const stockReq = await prisma.stock_request.findFirst({
			where: { stock_handover_no: item },
			select: {
			  allotted_quantity: true,
			  status: true,
			  emp_id: true,
			  emp_name: true,
			  ulb_id: true,
			  inventory: {
				select: {
				  id: true,
				  subcategory: {
					select: {
					  name: true,
					},
				  },
				},
			  },
			  stock_req_product: true,
			},
		  });
  
		  if (!stockReq) {
			throw { error: true, message: 'Invalid stock handover number' };
		  }
  
		  if (stockReq?.status !== 1 && stockReq?.status !== 80) {
			throw { error: true, message: 'Stock request is not valid to be approved' };
		  }
  
		  const serialNosForSQL = serial_nos.map(sno => `'${sno}'`).join(', ');
  
		  // Fetch the required products from the database
		  const requiredProducts: any[] = await prisma.$queryRawUnsafe(`
			SELECT *
			FROM product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
			WHERE is_available = true AND serial_no in (${serialNosForSQL})
		  `);
  
		  const requiredProductSum: number = requiredProducts.reduce((sum, product) => sum + product?.quantity, 0);
  
		  if (stockReq?.allotted_quantity > requiredProductSum) {
			throw { error: true, message: 'Available quantity not sufficient' };
		  }
  
		  let assignedQuantityBuffer: number = 0;
		  await prisma.$transaction(async tx => {
			await Promise.all(
			  requiredProducts.map(async (product, index) => {
				let quantityToUpdate: number = 0;
  
				// Check if quantity is available or not
				if (Number(product?.quantity) - (Number(stockReq?.allotted_quantity) - assignedQuantityBuffer) <= 0) {
				  assignedQuantityBuffer = assignedQuantityBuffer + Number(product?.quantity);
  
				  const productQuantity: any[] = await tx.$queryRawUnsafe(`
					SELECT quantity 
					FROM product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
					WHERE serial_no = '${product?.serial_no as string}'
				  `);
				  quantityToUpdate = productQuantity[0].quantity as number;
  
				  await tx.$queryRawUnsafe(`
					UPDATE product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
					SET is_available = false, quantity=0, updatedAt = CURRENT_TIMESTAMP
					WHERE serial_no = '${product?.serial_no as string}'
				  `);
  
				} else {
				  await tx.$queryRawUnsafe(`
					UPDATE product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
					SET quantity=${Number(product?.quantity) - (Number(stockReq?.allotted_quantity) - assignedQuantityBuffer)}, updatedAt = CURRENT_TIMESTAMP
					WHERE serial_no = '${product?.serial_no as string}'
				  `);
				  quantityToUpdate = Number(stockReq?.allotted_quantity) - assignedQuantityBuffer;
				}
  
				// Check if the combination of `emp_id` and `serial_no` exists
				const existingHandover = await tx.stock_handover.findUnique({
				  where: {
					emp_id_serial_no: {
					  emp_id: stockReq?.emp_id,
					  serial_no: product?.serial_no as string,
					},
				  },
				});
  
				if (!existingHandover) {
				  // If no existing record, insert the new record into `stock_handover`
				  await tx.stock_handover.create({
					data: {
					  stock_handover_no: item,
					  emp_id: stockReq?.emp_id,
					  emp_name: stockReq?.emp_name,
					  ulb_id: stockReq?.ulb_id,
					  serial_no: product?.serial_no as string,
					  quantity: quantityToUpdate,
					  inventoryId: stockReq?.inventory?.id as string,
					},
				  });
				} else {
				  // If record exists, log or update it as necessary
				  console.log(`Record with emp_id: ${stockReq?.emp_id} and serial_no: ${product?.serial_no} already exists.`);
				}
  
				// Create stock_req_product record
				await tx.stock_req_product.create({
				  data: {
					stock_handover_no: item,
					serial_no: product?.serial_no as string,
					inventoryId: stockReq?.inventory?.id as string,
					quantity: quantityToUpdate,
				  },
				});
			  })
			);
  
			// Update stock request status to approved (3)
			await tx.stock_request.update({
			  where: {
				stock_handover_no: item,
			  },
			  data: {
				status: 3,
			  },
			});
  
			// Insert records into various inbox and outbox tables
			await tx.ia_stock_req_outbox.create({
			  data: { stock_handover_no: item },
			});
			await tx.dist_stock_req_inbox.create({
			  data: { stock_handover_no: item },
			});
			await tx.da_stock_req_inbox.create({
			  data: { stock_handover_no: item },
			});
  
			// Update inventory quantity
			await tx.inventory.update({
			  where: { id: stockReq?.inventory?.id as string },
			  data: {
				quantity: {
				  decrement: Number(stockReq?.allotted_quantity),
				},
			  },
			});
  
			// Delete old stock request records from inbox/outbox
			await tx.ia_stock_req_inbox.delete({
			  where: {
				stock_handover_no: item,
			  },
			});
			await tx.dist_stock_req_outbox.delete({
			  where: {
				stock_handover_no: item,
			  },
			});
			await tx.da_stock_req_outbox.delete({
			  where: {
				stock_handover_no: item,
			  },
			});
  
			// Create notifications
			await tx.notification.create({
			  data: {
				role_id: Number(process.env.ROLE_DIST),
				title: 'Stock approved',
				destination: 40,
				from: await extractRoleName(Number(process.env.ROLE_IA)),
				description: `Stock request: ${item} has been approved.`,
				ulb_id,
			  },
			});
			await tx.notification.create({
			  data: {
				role_id: Number(process.env.ROLE_DA),
				title: 'Stock approved',
				destination: 25,
				from: await extractRoleName(Number(process.env.ROLE_IA)),
				description: `Stock request: ${item} has been approved.`,
				ulb_id,
			  },
			});
		  });
		})
	  );
  
	  return 'Approved';
	} catch (err: any) {
	  console.log(err);
	  return { error: true, message: getErrorMessage(err) };
	}
  };
  

// export const approveStockReqDal = async (req: Request) => {
// 	const { stock_handover_no }: { stock_handover_no: string[] } = req.body

// 	try {
// 		await Promise.all(
// 			stock_handover_no.map(async (item: string) => {
// 				const stockReq = await prisma.stock_request.findFirst({
// 					where: { stock_handover_no: item },
// 					select: {
// 						allotted_quantity: true,
// 						status: true,
// 						inventory: {
// 							select: {
// 								id: true,
// 								subcategory: {
// 									select: {
// 										name: true,
// 									},
// 								},
// 							},
// 						},
// 						stock_req_product: true,
// 					},
// 				})

// 				if (!stockReq) {
// 					throw { error: true, message: 'Invalid stock handover number' }
// 				}

// 				if (stockReq?.status !== 1 && stockReq?.status !== 80) {
// 					throw { error: true, message: 'Stock request is not valid to be approved' }
// 				}

// 				// const customStockReq = {
// 				// 	allotted_quantity: 15,
// 				// 	inventory: {
// 				// 		id: '145b20bb-998b-4ffa-9e78-f9001e5f1d15',
// 				// 		subcategory: {
// 				// 			name: 'Aggregate',
// 				// 		},
// 				// 	},
// 				// }

// 				const requiredProducts = await fetchRequiredProducts(stockReq)
// 				// console.log(requiredProducts.length)

// 				let assignedQuantityBuffer: number = 0
// 				await prisma.$transaction(async tx => {
// 					await Promise.all(
// 						requiredProducts.map(async (product, index) => {
// 							// console.log('bufferWithoutIf', `${assignedQuantityBuffer} ${index}`)
// 							// console.log('product qty', product?.quantity)
// 							// console.log('calc', Number(product?.quantity) - (Number(stockReq?.allotted_quantity) - assignedQuantityBuffer))
// 							if (Number(product?.quantity) - (Number(stockReq?.allotted_quantity) - assignedQuantityBuffer) < 0) {
// 								assignedQuantityBuffer = assignedQuantityBuffer + Number(product?.quantity)
// 								// console.log('if', `${assignedQuantityBuffer} ${index}`)
// 								await tx.$queryRawUnsafe(`
// 									UPDATE product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
// 									SET is_available = false, quantity=0, updatedAt = CURRENT_TIMESTAMP
// 									WHERE serial_no = '${product?.serial_no as string}'
// 								`)
// 							} else {
// 								await tx.$queryRawUnsafe(`
// 									UPDATE product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
// 									SET quantity=${Number(product?.quantity) - (Number(stockReq?.allotted_quantity) - assignedQuantityBuffer)}, updatedAt = CURRENT_TIMESTAMP
// 									WHERE serial_no = '${product?.serial_no as string}'
// 								`)
// 								// console.log('else', `${assignedQuantityBuffer} ${index}`)
// 							}

// 							await tx.stock_req_product.create({
// 								data: {
// 									stock_handover_no: item,
// 									serial_no: product?.serial_no as string,
// 									inventoryId: stockReq?.inventory?.id as string,
// 								},
// 							})
// 						})
// 					)
// 					await tx.stock_request.update({
// 						where: {
// 							stock_handover_no: item,
// 						},
// 						data: {
// 							status: 3,
// 						},
// 					})
// 					await tx.ia_stock_req_outbox.create({
// 						data: { stock_handover_no: item },
// 					})
// 					await tx.dist_stock_req_inbox.create({
// 						data: { stock_handover_no: item },
// 					})
// 					await tx.da_stock_req_inbox.create({
// 						data: { stock_handover_no: item },
// 					})
// 					await tx.inventory.update({
// 						where: { id: stockReq?.inventory?.id as string },
// 						data: {
// 							quantity: {
// 								decrement: Number(stockReq?.allotted_quantity),
// 							},
// 						},
// 					})
// 					await tx.ia_stock_req_inbox.delete({
// 						where: {
// 							stock_handover_no: item,
// 						},
// 					})
// 					await tx.dist_stock_req_outbox.delete({
// 						where: {
// 							stock_handover_no: item,
// 						},
// 					})
// 					await tx.da_stock_req_outbox.delete({
// 						where: {
// 							stock_handover_no: item,
// 						},
// 					})
// 					await tx.notification.create({
// 						data: {
// 							role_id: Number(process.env.ROLE_DIST),
// 							title: 'Stock approved',
// 							destination: 40,
// 							description: `stock request : ${item} has approved`,
// 						},
// 					})
// 					await tx.notification.create({
// 						data: {
// 							role_id: Number(process.env.ROLE_DA),
// 							title: 'Stock approved',
// 							destination: 25,
// 							description: `stock request : ${item} has approved`,
// 						},
// 					})
// 				})
// 			})
// 		)
// 		return 'Approved'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

const fetchRequiredProducts = async (stockReq: any, limit: number = 1): Promise<any[]> => {
	let toReturn: any[]

	const products: any[] = await prisma.$queryRawUnsafe(
		`
			SELECT *
			FROM product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
			WHERE is_available = true AND inventory_id = '${stockReq?.inventory?.id as string}'
			ORDER BY updatedat DESC
			LIMIT ${limit}
			`
	)

	if (products.length < limit) {
		throw { error: true, message: 'Insufficient quantity' }
	}
	const totalAvailableQuantity = products.reduce((total, product) => total + product?.quantity, 0)

	if (stockReq?.allotted_quantity > totalAvailableQuantity) {
		toReturn = await fetchRequiredProducts(stockReq, limit + 1)
	} else {
		toReturn = products
	}
	return toReturn
}

export const returnStockReqDal = async (req: Request) => {
	const { stock_handover_no, remark }: { stock_handover_no: string[], remark?: string } = req.body
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
				if (status?.status !== 1 && status?.status !== 80) {
					throw { error: true, message: 'Stock request is not valid to be returned' }
				}

				await prisma.$transaction([
					prisma.ia_stock_req_outbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.dist_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.da_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.stock_request.update({
						where: {
							stock_handover_no: item,
						},
						data: {
							status: -1,
							remark: remark
						},
					}),
					prisma.ia_stock_req_inbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.dist_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.da_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DIST),
							title: 'Stock returned',
							destination: 40,
							from: await extractRoleName(Number(process.env.ROLE_IA)),
							description: `stock request : ${item} has returned`,
							ulb_id
						},
					}),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DA),
							title: 'Stock returned',
							destination: 25,
							from: await extractRoleName(Number(process.env.ROLE_IA)),
							description: `stock request : ${item} has returned`,
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
	const { stock_handover_no, remark }: { stock_handover_no: string[], remark: string } = req.body
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
					prisma.ia_stock_req_outbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.dist_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.da_stock_req_inbox.create({
						data: { stock_handover_no: item },
					}),
					prisma.stock_request.update({
						where: {
							stock_handover_no: item,
						},
						data: {
							status: -2,
							remark: remark
						},
					}),
					prisma.ia_stock_req_inbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.dist_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.dist_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.da_stock_req_outbox.delete({
						where: {
							stock_handover_no: item,
						},
					}),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DIST),
							title: 'Stock rejected',
							destination: 40,
							from: await extractRoleName(Number(process.env.ROLE_IA)),
							description: `stock request : ${item} has rejected`,
							ulb_id
						},
					}),
					prisma.notification.create({
						data: {
							role_id: Number(process.env.ROLE_DA),
							title: 'Stock rejected',
							destination: 25,
							from: await extractRoleName(Number(process.env.ROLE_IA)),
							description: `stock request : ${item} has rejected`,
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

export const getProductsBystockReqDal = async (req: Request) => {
	// const page: number | undefined = Number(req?.query?.page)
	// const take: number | undefined = Number(req?.query?.take)
	// const startIndex: number | undefined = (page - 1) * take
	// const endIndex: number | undefined = startIndex + take
	// let count: number
	// let totalPage: number
	// let pagination: pagination = {}
	// const whereClause: any = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const { stock_handover_no } = req.params

	try {

		const stockReq = await prisma.stock_request.findFirst({
			where: { stock_handover_no: stock_handover_no },
			select: {
				allotted_quantity: true,
				status: true,
				inventory: {
					select: {
						id: true,
						subcategory: {
							select: {
								name: true,
							},
						},
					},
				},
				stock_req_product: true,
			},
		})

		const query = `
			SELECT *
			FROM product.product_${stockReq?.inventory?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
			WHERE is_available = true AND inventory_id = '${stockReq?.inventory?.id as string}'
			${search ? `AND (serial_no ILIKE '%${search}%')` : ''}
			ORDER BY updatedat DESC
`

		const products: any[] = await prisma.$queryRawUnsafe(query);


		return products

		// totalPage = Math.ceil(count / take)
		// if (endIndex < count) {
		// 	pagination.next = {
		// 		page: page + 1,
		// 		take: take,
		// 	}
		// }
		// if (startIndex > 0) {
		// 	pagination.prev = {
		// 		page: page - 1,
		// 		take: take,
		// 	}
		// }
		// pagination.currentPage = page
		// pagination.currentTake = take
		// pagination.totalPage = totalPage
		// pagination.totalResult = count
		// return {
		// 	data: resultToSend,
		// 	pagination: pagination,
		// }
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const unavailabilityNotificationDal = async (req: Request) => {
	const { stock_handover_no } = req.params
	const ulb_id = req?.body?.auth?.ulb_id

	try {

		await prisma.$transaction(async tx => {
			await tx.stock_request.update({
				where: {
					stock_handover_no: stock_handover_no
				},
				data: {
					is_notified: 1 //flag changed to 'notified'
				}
			})

			await tx.notification.create({
				data: {
					role_id: Number(process.env.ROLE_DA),
					title: 'Stock unavailable',
					destination: 0,
					from: await extractRoleName(Number(process.env.ROLE_IA)),
					description: ` Stock request : ${stock_handover_no} is currently unavailable. Want to procure?`,
					ulb_id
				},
			})
		})

		return 'Notified'

	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}
import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import getErrorMessage from '../../../../lib/getErrorMessage'
import { pagination } from '../../../../type/common.type'

const prisma = new PrismaClient()

export const getIaStockReqReportDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.ia_stock_req_inboxWhereInput = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	console.log(from, to)
	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				stock_handover_no: {
					contains: search,
					mode: 'insensitive',
				}
			}

		]
	}

	if (category[0] || subcategory[0] || from || to) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						stock_request: {
							stock_req_product: {
								some: {
									inventory: {
										category_masterId: {
											in: category,
										},
									}
								}
							}
						}

					},
				]
				: []),
			...(subcategory[0]
				? [

					{
						stock_request: {
							stock_req_product: {
								some: {
									inventory: {
										subcategory_masterId: {
											in: subcategory,
										},
									}
								}
							}
						}

					},
				]
				: []),
			...(from && to
				? [
					{
						createdAt: {
							gte: new Date(from),
							lte: new Date(to)
						}
					}
				]
				: [])
		]
	}

	whereClause.stock_request = {
		status: {
			in: [80]
		}
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
						emp_id: true,
						emp_name: true,
						allotted_quantity: true,
						inventory: {
							select: {
								id: true,
								category: {
									select: {
										id: true,
										name: true
									}
								},
								subcategory: {
									select: {
										id: true,
										name: true
									}
								},
								unit: {
									select: {
										id: true,
										name: true,
										abbreviation: true
									}
								},
								description: true,
								quantity: true,
								warranty: true,
							}
						}
					}
				},
				createdAt: true
			},
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
			data: result,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getIaServiceReqReportDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.ia_service_req_inboxWhereInput = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				service_no: {
					contains: search,
					mode: 'insensitive',
				}
			}

		]
	}

	if (category[0] || subcategory[0] || from || to) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						service_req: {
							service_req_product: {
								some: {
									inventory: {
										category_masterId: {
											in: category,
										},
									}
								}
							}
						}

					},
				]
				: []),
			...(subcategory[0]
				? [

					{
						service_req: {
							service_req_product: {
								some: {
									inventory: {
										subcategory_masterId: {
											in: subcategory,
										},
									}
								}
							}
						}

					},
				]
				: []),
			...(from && to
				? [
					{
						createdAt: {
							gte: new Date(from),
							lte: new Date(to)
						}
					}
				]
				: [])
		]
	}

	whereClause.service_req = {
		status: {
			in: [20]
		}
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
						inventory: {
							select: {
								id: true,
								category: {
									select: {
										id: true,
										name: true
									}
								},
								subcategory: {
									select: {
										id: true,
										name: true
									}
								},
								unit: {
									select: {
										id: true,
										name: true,
										abbreviation: true
									}
								},
								description: true,
								quantity: true,
								warranty: true,
							}
						}

					}
				},
				createdAt: true
			},
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
			data: result,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}


export const getIaProcurementReportDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.ia_pre_procurement_inboxWhereInput = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				procurement_no: {
					contains: search,
					mode: 'insensitive',
				}
			}

		]
	}

	if (category[0] || subcategory[0] || from || to) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						procurement: {
							category_masterId: {
								in: category,
							},
						}

					}
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
						}

					},
				]
				: []),
			...(from && to
				? [
					{
						createdAt: {
							gte: new Date(from),
							lte: new Date(to)
						}
					}
				]
				: [])
		]
	}

	whereClause.procurement = {
		status: {
			in: [0, 11]
		}
	}

	try {
		count = await prisma.ia_pre_procurement_inbox.count({
			where: whereClause,
		})
		const result: any = await prisma.ia_pre_procurement_inbox.findMany({
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
						total_rate: true,
						is_rate_contract: true,
						category: {
							select: {
								id: true,
								name: true
							}
						},
						procurement_stocks: {
							select: {
								category: {
									select: {
										id: true,
										name: true
									}
								},
								subCategory: {
									select: {
										id: true,
										name: true
									}
								},
								unit: {
									select: {
										id: true,
										name: true,
										abbreviation: true
									}
								},
								description: true,
								quantity: true,
								rate: true,
								total_rate: true
							}
						}
					}
				},
				createdAt: true
			},
		})

		const arrayToReturn: any[] = []

		result?.forEach((item: any) => {
			const temp = { ...item?.procurement }
			delete item.procurement
			arrayToReturn.push({ ...item, ...temp })
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
			data: arrayToReturn,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getIaBoqReportDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.acc_boq_inboxWhereInput = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				reference_no: {
					contains: search,
					mode: 'insensitive',
				}
			}

		]
	}

	if (category[0] || subcategory[0] || from || to) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						boq: {
							procurement: {
								category_masterId: {
									in: category,
								},
							}
						}

					}
				]
				: []),
			...(subcategory[0]
				? [

					{
						boq: {
							procurement: {
								procurement_stocks: {
									some: {
										subCategory_masterId: {
											in: subcategory,
										},
									}
								}
							}
						}

					},
				]
				: []),
			...(from && to
				? [
					{
						createdAt: {
							gte: new Date(from),
							lte: new Date(to)
						}
					}
				]
				: [])
		]
	}

	whereClause.boq = {
		status: {
			in: [0, 41]
		}
	}

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
						procurement_no: true,
						estimated_cost: true,
						hsn_code: true,
						procurements: {
							select: {
								quantity: true,
								rate: true,
								amount: true
							}
						},
						procurement: {
							select: {
								procurement_stocks: {
									select: {
										category: {
											select: {
												id: true,
												name: true
											}
										},
										subCategory: {
											select: {
												id: true,
												name: true
											}
										},
										unit: {
											select: {
												id: true,
												name: true,
												abbreviation: true
											}
										},
										description: true,
										quantity: true,
										rate: true,
										total_rate: true
									}
								}
							}
						}
					}
				},
				createdAt: true
			},
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
			data: result,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getIaTenderReportDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.acc_boq_inboxWhereInput = {}

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				reference_no: {
					contains: search,
					mode: 'insensitive',
				}
			}

		]
	}

	if (category[0] || subcategory[0] || from || to) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						boq: {
							procurement: {
								category_masterId: {
									in: category,
								},
							}
						}

					}
				]
				: []),
			...(subcategory[0]
				? [

					{
						boq: {
							procurement: {
								procurement_stocks: {
									some: {
										subCategory_masterId: {
											in: subcategory,
										},
									}
								}
							}
						}

					},
				]
				: []),
			...(from && to
				? [
					{
						boq: {
							pre_tendering_details: {
								createdAt: {
									gte: new Date(from),
									lte: new Date(to)
								}
							}
						}
					}
				]
				: [])
		]
	}

	whereClause.boq = {
		status: {
			in: [50]
		}
	}

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
						procurement_no: true,
						estimated_cost: true,
						hsn_code: true,
						procurements: {
							select: {
								quantity: true,
								rate: true,
								amount: true
							}
						},
						pre_tendering_details: {
							select: {
								emd: true,
								emd_type: true,
								emd_value: true,
								estimated_amount: true,
								createdAt: true
							}
						},
						procurement: {
							select: {
								procurement_stocks: {
									select: {
										category: {
											select: {
												id: true,
												name: true
											}
										},
										subCategory: {
											select: {
												id: true,
												name: true
											}
										},
										unit: {
											select: {
												id: true,
												name: true,
												abbreviation: true
											}
										},
										description: true,
										quantity: true,
										rate: true,
										total_rate: true
									}
								}
							}
						}
					}
				}
			},
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
			data: result,
			pagination: pagination,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}
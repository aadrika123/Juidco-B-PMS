import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const getTotalStocksDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page);
	const take: number | undefined = Number(req?.query?.take);
	const from = req?.query?.from; // yyyy-mm-dd
	const to = req?.query?.to; // yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take;
	const endIndex: number | undefined = startIndex + take;
	let count: number;
	let totalPage: number;
	let pagination: pagination = {};
	const whereClause: Prisma.inventoryWhereInput = {};
	const ulb_id = req?.body?.auth?.ulb_id;
	const dataToSend: any[] = [];

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined;

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category];
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory];

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				description: {
					contains: search,
					mode: 'insensitive',
				},
			},
		];
	}

	if (category[0] || subcategory[0]) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						category_masterId: {
							in: category,
						},
					},
				]
				: []),
			...(subcategory[0]
				? [
					{
						subcategory_masterId: {
							in: subcategory,
						},
					},
				]
				: []),
			{
				ulb_id: ulb_id,
			},
		];
	} else {
		whereClause.AND = [
			{
				ulb_id: ulb_id,
			},
		];
	}

	try {
		count = await prisma.inventory.count({
			where: whereClause,
		});
		const result = await prisma.inventory.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
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
				unit: {
					select: {
						id: true,
						name: true,
						abbreviation: true,
					},
				},
				description: true,
				quantity: true,
				warranty: true,
				supplier_master: true,
			},
		});

		const formattedFrom = from ? `${from} 00:00:00` : null;
		const formattedTo = to ? `${to} 23:59:59` : null;

		await Promise.all(
			result.map(async (item: any) => {
				const products: any[] = await prisma.$queryRawUnsafe(`
					SELECT sum(opening_quantity) as opening_quantity, serial_no, brand, quantity, opening_quantity, is_available, procurement_stock_id, updatedat
					FROM product.product_${item?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
					WHERE inventory_id = '${item?.id}'
					${formattedFrom && formattedTo ? `and updatedat between '${formattedFrom}' and '${formattedTo}'` : ''}
					group by serial_no, brand, quantity, opening_quantity, is_available, procurement_stock_id, updatedat
				`);

				const productsTotal: any[] = await prisma.$queryRawUnsafe(`
					SELECT sum(opening_quantity) as opening_quantity
					FROM product.product_${item?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
					WHERE inventory_id = '${item?.id}'
					${formattedFrom && formattedTo ? `and updatedat between '${formattedFrom}' and '${formattedTo}'` : ''}
				`);

				const stockReq = await prisma.stock_req_product.aggregate({
					where: {
						inventoryId: item?.id,
					},
					_sum: {
						quantity: true,
					},
				});

				if (products.length !== 0) {
					item.products = products;
					const deadStock = await prisma.inventory_dead_stock.aggregate({
						where: {
							inventoryId: item?.id,
						},
						_sum: {
							quantity: true,
						},
					});
					item.dead_stock = deadStock?._sum?.quantity;
					item.total_quantity =
						Number(productsTotal[0]?.opening_quantity) +
						Number(deadStock?._sum?.quantity) +
						Number(stockReq?._sum?.quantity);

					// Make sure the quantity is not negative
					if (item.quantity >= 0 && item.total_quantity >= 0) {
						// Only push the item to dataToSend if its quantity is positive or zero
						dataToSend.push(item);
					} else {
						count = count - 1; // Exclude this item from the count if quantities are negative
					}
				} else {
					count = count - 1; // Exclude this item from the count if no products are found
				}
			})
		);

		// Sorting the results after all the checks
		dataToSend.sort((a, b) => {
			if (a.category.name < b.category.name) return -1;
			if (a.category.name > b.category.name) return 1;
			return a.total_quantity - b.total_quantity; // Sorting by total_quantity (ascending)
		});

		totalPage = Math.ceil(count / take);
		if (endIndex < count) {
			pagination.next = {
				page: page + 1,
				take: take,
			};
		}
		if (startIndex > 0) {
			pagination.prev = {
				page: page - 1,
				take: take,
			};
		}
		pagination.currentPage = page;
		pagination.currentTake = take;
		pagination.totalPage = totalPage;
		pagination.totalResult = count;

		return {
			data: dataToSend,
			pagination: pagination,
		};
	} catch (err: any) {
		console.log(err);
		return { error: true, message: getErrorMessage(err) };
	}
};


// export const getProcurementStocksDal = async (req: Request) => {
// 	const page: number | undefined = Number(req?.query?.page)
// 	const take: number | undefined = Number(req?.query?.take)
// 	const from = req?.query?.from//yyyy-mm-dd
// 	const to = req?.query?.to//yyyy-mm-dd
// 	const startIndex: number | undefined = (page - 1) * take
// 	const endIndex: number | undefined = startIndex + take
// 	let count: number
// 	let totalPage: number
// 	let pagination: pagination = {}
// 	const whereClause: Prisma.procurementWhereInput = {}
// 	const ulb_id = req?.body?.auth?.ulb_id
// 	const dataToSend: any[] = []

// 	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

// 	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
// 	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

// 	//creating search options for the query
// 	if (search) {
// 		whereClause.OR = [
// 			{
// 				procurement_no: {
// 					contains: search,
// 					mode: 'insensitive',
// 				  },
// 			}
// 		]
// 	}

// 	if (category[0] || subcategory[0]) {
// 		whereClause.AND = [
// 			...(category[0]
// 				? [
// 					{
// 						category_masterId: {
// 							in: category,
// 						},

// 					},
// 				]
// 				: []),
// 			...(subcategory[0]
// 				? [
// 					{
// 						// subcategory_masterId: {
// 						// 	in: subcategory,
// 						// },
// 						category_masterId: {
// 							in: subcategory, 
// 						  },
// 					},
// 				]
// 				: []),
// 			{
// 				ulb_id: ulb_id
// 			}
// 		]
// 	} else {
// 		whereClause.AND = [
// 			{
// 				ulb_id: ulb_id
// 			}
// 		]
// 	}

// 	try {
// 		count = await prisma.procurement.count({
// 			where: whereClause,
// 		})
// 		const result = await prisma.procurement.findMany({
// 			orderBy: {
// 				updatedAt: 'desc',
// 			},
// 			where: whereClause,
// 			...(page && { skip: startIndex }),
// 			...(take && { take: take }),
// 			select: {
// 				id: true,
// 				category: {
// 					select: {
// 						id: true,
// 						name: true,
// 					}
// 				},
// 				supplier_master: true,
// 				status: true,
// 			},
// 		});
		
		


// 		const formattedFrom = from ? `${from} 00:00:00` : null;
// 		const formattedTo = to ? `${to} 23:59:59` : null;

// 		await Promise.all(
// 			result.map(async (item: any, index: number) => {
// 				const products: any[] = await prisma.$queryRawUnsafe(`
// 					SELECT sum(opening_quantity) as opening_quantity, serial_no,brand,quantity,opening_quantity,is_available,procurement_stock_id,updatedat
// 					FROM product.product_${item?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
// 					WHERE inventory_id = '${item?.id}'
// 						${formattedFrom && formattedTo ? `and updatedat between '${formattedFrom}' and '${formattedTo}'` : ''}
// 					group by serial_no,brand,quantity,opening_quantity,is_available,procurement_stock_id,updatedat
// 					`)

// 				const productsTotal: any[] = await prisma.$queryRawUnsafe(`
// 						SELECT sum(opening_quantity) as opening_quantity
// 						FROM product.product_${item?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
// 						WHERE inventory_id = '${item?.id}'
// 							${formattedFrom && formattedTo ? `and updatedat between '${formattedFrom}' and '${formattedTo}'` : ''}
// 						`)

// 				const stockReq = await prisma.stock_req_product.aggregate({
// 					where: {
// 						inventoryId: item?.id
// 					},
// 					_sum: {
// 						quantity: true
// 					}
// 				})

// 				if (products.length !== 0) {
// 					// item.opening_quantity = products[0]?.opening_quantity
// 					item.products = products
// 					const deadStock = await prisma.inventory_dead_stock.aggregate({
// 						where: {
// 							inventoryId: item?.id
// 						},
// 						_sum: {
// 							quantity: true
// 						}
// 					})
// 					item.dead_stock = deadStock?._sum?.quantity
// 					item.total_quantity = Number(productsTotal[0]?.opening_quantity) + Number(deadStock?._sum?.quantity) + Number(stockReq?._sum.quantity)
// 					// item.quantity = Number(productsTotal[0]?.opening_quantity)
// 					item.quantity = item.quantity
// 					dataToSend.push(item);

//       dataToSend.sort((a, b) => {
//     if (a.name < b.name) return -1;
//     if (a.name > b.name) return 1;
//     return a.quantity - b.quantity; 
// });
// 				} else {
// 					count = count - 1
// 				}
// 			})
// 		)

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
// 			data: dataToSend,
// 			pagination: pagination,
// 		}
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
//   };
  
export const getProcurementStocksDal = async (req: Request) => {
    const page: number | undefined = Number(req?.query?.page) || 1; 
    const take: number | undefined = Number(req?.query?.take) || 10; 
    const from = req?.query?.from; 
    const to = req?.query?.to; 
    const ulb_id = req?.body?.auth?.ulb_id; 
    const status = req?.query?.status_level ? Number(req.query.status_level) : undefined; 
    let category_masterid = req?.query?.category_masterid;
    const search = (req?.query?.search || '') as string; // Ensure it's treated as a string

    // Ensure category_masterid is a single string, not an array
    if (Array.isArray(category_masterid)) {
        category_masterid = category_masterid[0]; 
    }

    const startIndex: number = (page - 1) * take;
    const endIndex: number = startIndex + take;
    let count: number;
    let totalPage: number;
    let pagination: pagination = { currentPage: page, currentTake: take, totalPage: 0, totalResult: 0 };

    const whereClause: Prisma.procurementWhereInput = {};

    if (ulb_id) {
        whereClause.ulb_id = ulb_id; 
    }

    if (from && to) {
        whereClause.updatedAt = {
            gte: new Date(`${from}T00:00:00Z`), 
            lte: new Date(`${to}T23:59:59Z`), 
        };
    }

    if (category_masterid) {
        whereClause.category = {
            id: category_masterid, 
        };
    }

    if (status !== undefined) {
        whereClause.status = status; 
    }

    // Add a search condition if the search term is provided
    if (search) {
        whereClause.procurement_stocks = {
            some: {
                OR: [
                    {
                        description: {
                            contains: search, // Match the search term in the description field
                            mode: 'insensitive', // Case insensitive search
                        },
                    },
                    {
                        procurement_no: {
                            contains: search, // Match the search term in procurement_no
                            mode: 'insensitive', // Case insensitive search
                        },
                    }
                ]
            }
        };
    }

    const dataToSend: any[] = [];

    try {
        const result = await prisma.procurement.findMany({
            orderBy: {
                updatedAt: 'desc', 
            },
            where: whereClause,
            skip: startIndex, 
            take: take, 
            select: {
                id: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                supplier_master: true, 
                status: true,
                procurement_stocks: {
                    select: {
                        description: true, 
                        procurement_no: true,
                    },
                },
            },
        });

        dataToSend.push(...result);

        count = await prisma.procurement.count({
            where: whereClause,
        });

        totalPage = Math.ceil(count / take);

        if (endIndex < count) {
            pagination.next = {
                page: page + 1, 
                take: take,
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1, 
                take: take,
            };
        }

        pagination.totalPage = totalPage;
        pagination.totalResult = count;

        return {
            data: dataToSend,
            pagination: pagination,
        };
    } catch (err: any) {
        console.log(err); 
        return { error: true, message: getErrorMessage(err) }; 
    }
};



  
  
  
  



export const getTotalRemainingStocksDal = async (req: Request) => {
    const page: number | undefined = Number(req?.query?.page) || 1;
    const take: number | undefined = Number(req?.query?.take) || 10;
    const startIndex: number = (page - 1) * take;
    const endIndex: number = startIndex + take;
    let count: number;
    let totalPage: number;
    let pagination: pagination = {};
    const whereClause: Prisma.inventoryWhereInput = {};

    const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined;
    const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category];
    const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory];
    const ulb_id = req?.body?.auth?.ulb_id;

    // Ensure quantity is greater than zero
    whereClause.quantity = {
        gte: 1, // Filter out items with negative or zero quantity
    };

    // Apply other filters if necessary
    if (search) {
        whereClause.OR = [
            {
                description: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
        ];
    }

    if (category[0] || subcategory[0]) {
        whereClause.AND = [
            ...(category[0]
                ? [
                    {
                        category_masterId: {
                            in: category,
                        },
                    },
                ]
                : []),
            ...(subcategory[0]
                ? [
                    {
                        subcategory_masterId: {
                            in: subcategory,
                        },
                    },
                ]
                : []),
            {
                ulb_id: ulb_id,
            },
        ];
    } else {
        whereClause.AND = [
            {
                ulb_id: ulb_id,
            },
        ];
    }

    try {
        // Count the total number of records with positive quantities
        count = await prisma.inventory.count({
            where: whereClause,
        });

        // Calculate total pages
        totalPage = Math.ceil(count / take);

        // Fetch the paginated data
        const result = await prisma.inventory.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
            where: whereClause,
            skip: startIndex,
            take: take,
            select: {
                id: true,
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
                unit: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                description: true,
                quantity: true,
                warranty: true,
                supplier_master: true,
            },
        });

        // Pagination setup
        pagination.currentPage = page;
        pagination.currentTake = take;
        pagination.totalPage = totalPage;
        pagination.totalResult = count;

        // Pagination navigation logic (Next and Prev links)
        if (page < totalPage) {
            pagination.next = {
                page: page + 1,
                take: take,
            };
        }

        if (page > 1) {
            pagination.prev = {
                page: page - 1,
                take: take,
            };
        }

        // Return the filtered data
        return {
            data: result,
            pagination: pagination,
            totalResults: count, // Display total results on the front-end
        };
    } catch (err: any) {
        console.log(err);
        return { error: true, message: getErrorMessage(err) };
    }
};







export const getDeadStocksDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.inventory_dead_stockWhereInput = {}
	const ulb_id = req?.body?.auth?.ulb_id

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				inventory: {
					description: {
						contains: search,
						mode: 'insensitive',
					}
				},
			}
		]
	}

	if (category[0] || subcategory[0] || from || to) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						inventory: {
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
						inventory: {
							subcategory_masterId: {
								in: subcategory,
							},
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
				: []),
			{
				inventory: {
					ulb_id: ulb_id
				}
			}
		]
	} else {
		whereClause.AND = [
			{
				inventory: {
					ulb_id: ulb_id
				}
			}
		]
	}


	try {
		count = await prisma.inventory_dead_stock.count({
			where: whereClause,
		})
		const result = await prisma.inventory_dead_stock.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				serial_no: true,
				remark1: true,
				remark2: true,
				quantity: true,
				inventory: {
					select: {
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
						description: true
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

export const getStockMovementDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page)
	const take: number | undefined = Number(req?.query?.take)
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined//yyyy-mm-dd
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined//yyyy-mm-dd
	const startIndex: number | undefined = (page - 1) * take
	const endIndex: number | undefined = startIndex + take
	let count: number
	let totalPage: number
	let pagination: pagination = {}
	const whereClause: Prisma.stock_req_productWhereInput = {}
	const ulb_id = req?.body?.auth?.ulb_id

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]

	//creating search options for the query
	if (search) {
		whereClause.OR = [
			{
				inventory: {
					description: {
						contains: search,
						mode: 'insensitive',
					}
				},
			}
		]
	}

	if (category[0] || subcategory[0] || from || to) {
		whereClause.AND = [
			...(category[0]
				? [
					{
						inventory: {
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
						inventory: {
							subcategory_masterId: {
								in: subcategory,
							},
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

	whereClause.stock_request = {
		status: {
			notIn: [-2, -1, 0, 1, 2, 80, 81, 82]
		}
	}


	try {
		count = await prisma.stock_req_product.count({
			where: whereClause,
		})
		const result = await prisma.stock_req_product.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
			...(page && { skip: startIndex }),
			...(take && { take: take }),
			select: {
				id: true,
				stock_handover_no: true,
				serial_no: true,
				quantity: true,
				stock_request: {
					select: {
						id: true,
						createdAt: true,
						emp_id: true,
						emp_name: true,
						stock_handover: {
							select: {
								createdAt: true
							}
						}
					}
				},
				inventory: {
					select: {
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
						description: true
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
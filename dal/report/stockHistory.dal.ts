import { Request } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import getErrorMessage from '../../lib/getErrorMessage'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const getStockListDal = async (req: Request) => {
	const page: number | undefined = Number(req?.query?.page) || 1;
	const take: number | undefined = Number(req?.query?.take) || 10; 
	const from: string | undefined = req?.query?.from ? String(req?.query?.from) : undefined; 
	const to: string | undefined = req?.query?.to ? String(req?.query?.to) : undefined; 
	const startIndex: number = (page - 1) * take; 
	const endIndex: number = startIndex + take; 

	let totalPage: number;
	let pagination: pagination = {};
	const whereClause: Prisma.inventoryWhereInput = {};
	const ulb_id = req?.body?.auth?.ulb_id;

	const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined;

	const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category];
	const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory];

	if (search) {
		whereClause.OR = [
			{
				description: {
					contains: search,
					mode: 'insensitive',
				},
			}
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
			...(from && to
				? [
					{
						createdAt: {
							gte: new Date(from),
							lte: new Date(to),
						},
					}
				]
				: []),
			{
				ulb_id: ulb_id,
			}
		];
	} else {
		whereClause.AND = [
			{
				ulb_id: ulb_id,
			}
		];
	}

	try {
		const result = await prisma.inventory.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: whereClause,
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
			},
		});

		const enhancedResult = await Promise.all(
			result.map(async (item) => {
				const warranty = await prisma.inventory_warranty.findFirst({
					where: {
						inventoryId: item.id,
					},
				});

				const deadStock = await prisma.inventory_dead_stock.findFirst({
					where: {
						inventoryId: item.id,
					},
				});
				let statuses: { status: string; inventoryId: string }[] = [];

				if (warranty) {
					statuses.push({
						status: "Warranty", 
						inventoryId: item.id,
					});
				}

				if (deadStock) {
					statuses.push({
						status: "Dead Stock", 
						inventoryId: item.id,
					});
				}
				if (statuses.length === 0) {
					statuses.push({
						status: "Inventory", 
						inventoryId: item.id,
					});
				}
				return statuses.map((statusItem) => ({
					...item,
					status: statusItem.status, 
					inventoryId: statusItem.inventoryId, 
				}));
			})
		);

		const flattenedResult = enhancedResult.flat();

		const count = flattenedResult.length;
		totalPage = Math.ceil(count / take); 

		const paginatedResult = flattenedResult.slice(startIndex, endIndex);

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
			status: true,
			message: 'Stock list fetched successfully',
			data: paginatedResult,
			pagination: pagination,
		};
	} catch (err: any) {
		console.log(err);
		return { error: true, message: getErrorMessage(err) };
	}
};






export const getStockHistoryDal = async (req: Request) => {

	const { inventory } = req.params

	try {
		const inventoryData: any = await prisma.inventory.findFirst({
			where: {
				id: inventory
			},
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
			},
		})

		const products: any[] = await prisma.$queryRawUnsafe(`
			SELECT *
			FROM product.product_${inventoryData?.subcategory?.name.toLowerCase().replace(/\s/g, '')}
			WHERE inventory_id = '${inventory}'
			`)

		const procurementNumbers: string[] = []
		products.filter((item) => {
			if (!procurementNumbers.includes(item?.procurement_no)) {
				procurementNumbers.push(item?.procurement_no)
			}
		})

		const procurements: any[] = []

		await Promise.all(
			procurementNumbers.map(async (item) => {
				const procurement = await prisma.procurement.findFirst({
					where: {
						procurement_no: item
					},
					select: {
						procurement_no: true,
						total_rate: true,
						createdAt: true
					}
				})
				procurements.push(procurement)
			})
		)

		const handoverData = await prisma.stock_handover.findMany({
			where: {
				inventoryId: inventoryData?.id
			}
		})

		inventoryData.products = products
		inventoryData.procurements = procurements
		inventoryData.handover = handoverData


		return inventoryData
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}
import { Request } from 'express'
import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient } from '@prisma/client'
import { procurementType } from '../stockReceiver/preProcurement.dal'
import { getImage } from '../../lib/getImage'

const prisma = new PrismaClient()

export const getProcurementByProcurementNoDal = async (req: Request) => {
	const { procurement_no } = req.params
	try {
		const result = await prisma.procurement.findFirst({
			where: {
				procurement_no: procurement_no,
			},
			select: {
				id: true,
				procurement_no: true,
				category: true,
				total_rate: true,
				isEdited: true,
				is_partial: true,
				status: true,
				remark: true,
				is_rate_contract: true,
				procurement_stocks: {
					select: {
						id: true,
						category: {
							select: {
								id: true,
								name: true,
							},
						},
						subCategory: {
							select: {
								id: true,
								name: true,
							},
						},
						unit: {
							select: {
								id: true,
								name: true,
							},
						},
						brand: {
							select: {
								id: true,
								name: true,
							},
						},
						gst: true,
						remark: true,
						rate: true,
						quantity: true,
						description: true,
						total_rate: true,
						is_partial: true,
						hsn_code: true
					},
				},
				supplier_master: true,
				post_procurement: true,
				receivings: {
					include: {
						procurement_stock: {
							select: {
								id: true,
								subCategory: {
									select: {
										id: true,
										name: true,
									},
								},
								description: true,
							},
						},
						receiving_image: {
							select: {
								ReferenceNo: true,
							},
						},
					},
				},
			},
		})

		console.log("resultresult",result)

		if (result?.procurement_stocks) {
			await Promise.all(
				result?.procurement_stocks.map(async (stock: any) => {
					const total = await prisma.receivings.aggregate({
						where: {
							procurement_no: procurement_no,
							procurement_stock_id: stock?.id,
						},
						_sum: {
							received_quantity: true,
						},
					})

					const totalAdded = await prisma.receivings.aggregate({
						where: {
							procurement_no: procurement_no,
							procurement_stock_id: stock?.id,
							is_added: true,
						},
						_sum: {
							received_quantity: true,
						},
					})
					stock.total_received = total?._sum?.received_quantity || 0
					stock.total_added = totalAdded?._sum?.received_quantity || 0
				})
			)
		}
		if (result?.receivings) {
			await Promise.all(
				result?.receivings.map(async (receiving: any) => {
					await Promise.all(
						receiving?.receiving_image.map(async (img: any) => {
							img.imageUrl = await getImage(img?.ReferenceNo)
						})
					)
				})
			)
		}

		if (result?.supplier_master) {
			await Promise.all(
				result?.supplier_master.map(async (supplier: any) => {
					const bidderData = await prisma.bidder_master.findFirst({
						where: {
							reference_no: supplier?.reference_no
						},
						select: {
							bidding_amount: true
						}
					})
					console.log(bidderData)
					supplier.bidding_amount = bidderData?.bidding_amount
				})
			)
		}

		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

type extendedProcurementType = procurementType & {
	id: string
}

export const editProcurementDal = async (req: Request) => {
	const { procurement_no, category, procurement }: { procurement_no: string; category: string; procurement: extendedProcurementType[] } = req.body

	// let updatedProcData: procurement

	try {
		const total_rate = procurement.reduce((total, item) => total + item?.total_rate, 0)
		//start transaction
		await prisma.$transaction(async tx => {
			await tx.procurement.update({
				where: { procurement_no: procurement_no },
				data: {
					category: { connect: { id: category } },
					total_rate: total_rate,
				},
			})

			await Promise.all(
				procurement.map(async item => {
					await tx.procurement_stocks.update({
						where: {
							id: item?.id,
						},
						data: {
							category_masterId: category,
							subCategory_masterId: item?.subcategory,
							unit_masterId: item?.unit,
							rate: Number(item?.rate),
							quantity: Number(item?.quantity),
							total_rate: Number(item?.total_rate),
							description: item?.description,
						},
					})
				})
			)
		})

		return 'Updated'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const getInventoryAdditionValidityNoDal = async (req: Request) => {
	const { procurement_stock_id } = req.params
	let is_valid_for_addition: boolean = false
	try {
		const procStock = await prisma.procurement_stocks.findFirst({
			where: {
				id: procurement_stock_id,
			},
			select: {
				subCategory: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		})

		const receiving = await prisma.receivings.aggregate({
			where: {
				procurement_stock_id: procurement_stock_id,
				is_added: false
			},
			_sum: {
				received_quantity: true,
			},
		})

		const product: any = await prisma.$queryRawUnsafe(`
			SELECT SUM(quantity) as total_quantity
			FROM product.product_${procStock?.subCategory?.name.toLowerCase().replace(/\s/g, '')}
			 WHERE is_added = false AND procurement_stock_id = '${procurement_stock_id}'
		`)

		if (Number(receiving?._sum?.received_quantity) === Number(product[0]?.total_quantity)) {
			is_valid_for_addition = true
		}

		return {
			receiving: receiving,
			product: product[0],
			is_valid_for_addition: is_valid_for_addition,
		}
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}


type procStockType = {
	id: string,
	subcategory?: string
	brand?: string
	unit?: string
	description?: string,
	rate?: number
	quantity?: number
	total_rate?: number

}

export const editProcurementStockDal = async (req: Request) => {
	const { id, subcategory, brand, unit, description, rate, total_rate, quantity }: procStockType = req.body;
  
	try {
	  // Step 1: Update the procurement stock
	  await prisma.procurement_stocks.update({
		where: {
		  id: id,
		},
		data: {
		  subCategory_masterId: subcategory,
		  brand_masterId: brand,
		  unit_masterId: unit,
		  rate: Number(rate),
		  quantity: Number(quantity),
		  total_rate: Number(total_rate),
		  description: description,
		},
	  });
  
	  // Step 2: Get the procurement_no associated with the updated stock
	  const procurementStock = await prisma.procurement_stocks.findUnique({
		where: { id: id },
		select: {
		  procurement_no: true,
		},
	  });
  
	  if (!procurementStock) {
		throw { error: true, message: 'Procurement stock not found' };
	  }
  
	  // Step 3: Calculate the new total_rate from the updated procurement_stocks
	  const updatedTotalRate = await prisma.procurement_stocks.aggregate({
		_sum: {
		  total_rate: true,
		},
		where: {
		  procurement_no: procurementStock.procurement_no,
		},
	  });
  
	  // Step 4: Update the total_rate in the procurement table based on the sum from procurement_stocks
	  if (updatedTotalRate._sum.total_rate !== null) {
		await prisma.procurement.update({
		  where: {
			procurement_no: procurementStock.procurement_no,
		  },
		  data: {
			total_rate: updatedTotalRate._sum.total_rate,
		  },
		});
	  }
  
	  return 'Updated';
	} catch (err: any) {
	  console.log(err);
	  return { error: true, message: err?.message };
	}
  };
  
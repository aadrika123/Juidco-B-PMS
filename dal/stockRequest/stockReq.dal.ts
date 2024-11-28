import { Request } from 'express'
import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getStockReqByStockHandoverNoDal = async (req: Request) => {
	const { stock_handover_no } = req.params;
	
	try {
	  const result = await prisma.stock_request.findFirst({
		where: {
		  stock_handover_no: stock_handover_no,  
		},
		select: {
		  id: true,
		  stock_handover_no: true,
		  ulb_id: true,
		  emp_id: true,
		  emp_name: true,
		  allotted_quantity: true,
		  isEdited: true,
		  status: true,
		  remark: true,
		  createdAt: true,
		  is_notified: true,
		  is_alloted: true,
		  stock_req_product: true,  
		  inventory: {  
			select: {
			  id: true,  
			  warranty:true,
			  description: true,
			//   category: {
			// 	select: {
			// 	  id: true,
			// 	  name: true,
			// 	},
			//   },
			//   subcategory: {
			// 	select: {
			// 	  id: true,
			// 	  name: true,
			// 	},
			//   },
			//   brand: {
			// 	select: {
			// 	  id: true,
			// 	  name: true,
			// 	},
			//   },
			//   unit: {
			// 	select: {
			// 	  id: true,
			// 	  name: true,
			// 	  abbreviation: true,
			// 	},
			//   },
			},
		  },
		  emp_service_request: {
			select: {
			  service_no: true,
			  service: true,
			  emp_service_req_product: true,  // Service request details
			},
		  },
		},
	  });
  
	  // Check if the stock request exists
	  if (!result) {
		return { error: true, message: "Stock request not found" };
	  }
  
	  // Return the data fetched from the database
	  return result;
	} catch (err: any) {
	  console.log(err);
	  return { error: true, message: getErrorMessage(err) };  // You may want to implement getErrorMessage to format errors
	}
  };
  

export const editStockRequestDal = async (req: Request) => {
	const { stock_handover_no, inventory, emp_id, emp_name, allotted_quantity } = req.body

	try {
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

		const data: any = {
			inventory: { connect: { id: inventory } },
			emp_id: emp_id,
			emp_name: emp_name,
			allotted_quantity: Number(allotted_quantity),
			isEdited: true,
		}

		let stockReq: any

		const oldStockReq = await prisma.stock_request.findFirst({
			where: {
				stock_handover_no: stock_handover_no,
			},
		})

		if (!oldStockReq) {
			throw { error: true, message: `Invalid stock handover number` }
		}

		const historyExist = await prisma.stock_request_history.count({
			where: {
				stock_handover_no: stock_handover_no,
			},
		})

		//start transaction
		await prisma.$transaction(async tx => {
			if (historyExist === 0) {
				await tx.stock_request_history.create({
					data: {
						stock_handover_no: oldStockReq?.stock_handover_no,
						emp_id: oldStockReq?.emp_id,
						emp_name: oldStockReq?.emp_name,
						allotted_quantity: oldStockReq?.allotted_quantity,
						status: oldStockReq?.status,
						inventoryId: oldStockReq?.inventoryId,
					},
				})
			}

			stockReq = await tx.stock_request.update({
				where: { stock_handover_no: stock_handover_no },
				data: data,
			})

			// await tx.inventory_buffer.update({
			// 	where: { stock_handover_no: stock_handover_no },
			// 	data: {
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

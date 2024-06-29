import { Request } from 'express'
import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getStockReqByStockHandoverNoDal = async (req: Request) => {
	const { stock_handover_no } = req.params
	try {
		const result: any = await prisma.stock_request.findFirst({
			where: {
				stock_handover_no: stock_handover_no,
			},
			select: {
				id: true,
				stock_handover_no: true,
				category: {
					select: {
						id:true,
						name: true,
					},
				},
				subcategory: {
					select: {
						id:true,
						name: true,
					},
				},
				brand: {
					select: {
						id:true,
						name: true,
					},
				},
				ulb_id: true,
				emp_id: true,
				emp_name: true,
				allotted_quantity: true,
				isEdited: true,
				status: true,
				createdAt: true,
				inventory: {
					select: {
						id:true,
						description: true,
					},
				},
			},
		})
		let resultToSend: any = {}

		const temp = { ...result?.procurement }
		delete result.procurement
		resultToSend = { ...result, ...temp }

		return resultToSend
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const editStockRequestDal = async (req: Request) => {
	const { stock_handover_no, category, subcategory, brand, inventory, emp_id, emp_name, allotted_quantity } = req.body

	try {
		const invData = await prisma.inventory.findFirst({
			where: {
				id: inventory,
			},
			select: {
				quantity: true,
			},
		})

		const invBuffer: any = await prisma.inventory_buffer.aggregate({
			where: {
				inventoryId: inventory,
			},
			_sum: {
				reserved_quantity: true,
			},
		})

		if (Number(allotted_quantity) > (Number(invData?.quantity) - invBuffer?._sum?.reserved_quantity || 0)) {
			throw { error: true, message: `Allotted quantity cannot be more than the available stock. Available stock : ${Number(invData?.quantity) - invBuffer?._sum?.reserved_quantity || 0} ` }
		}

		const data: any = {
			...(category && { category: { connect: { id: category } } }),
			subcategory: { connect: { id: subcategory } },
			brand: { connect: { id: brand } },
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

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.stock_request_history.create({
				data: {
					stock_handover_no: oldStockReq?.stock_handover_no,
					emp_id: oldStockReq?.emp_id,
					emp_name: oldStockReq?.emp_name,
					category_masterId: oldStockReq?.category_masterId,
					subcategory_masterId: oldStockReq?.subcategory_masterId,
					brand_masterId: oldStockReq?.brand_masterId,
					allotted_quantity: oldStockReq?.allotted_quantity,
					status: oldStockReq?.status,
				},
			})

			stockReq = await tx.stock_request.update({
				where: { stock_handover_no: stock_handover_no },
				data: data,
			})

			await tx.inventory_buffer.update({
				where: { stock_handover_no: stock_handover_no },
				data: {
					reserved_quantity: allotted_quantity,
					inventory: { connect: { id: inventory } },
				},
			})
		})

		return stockReq
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

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
				ulb_id: true,
				allotted_quantity: true,
				isEdited: true,
				status: true,
				createdAt: true,
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

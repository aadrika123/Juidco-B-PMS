import { Request, Response } from 'express'
import { getStockReqByStockHandoverNoDal, editStockRequestDal } from '../../dal/stockRequest/stockReq.dal'

export const getStockReqByStockHandoverNo = async (req: Request, res: Response) => {
	const result: any = await getStockReqByStockHandoverNoDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Stock request fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Stock request`,
			error: result?.message,
		})
	}
}

export const editStockRequest = async (req: Request, res: Response) => {
	const result: any = await editStockRequestDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Stock request Updated having stock handover number : ${result?.stock_handover_no}`,
			stock_handover_no: result?.stock_handover_no,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Stock request update failed`,
			error: result?.message,
		})
	}
}

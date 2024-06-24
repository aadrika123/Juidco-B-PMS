import { Request, Response } from 'express'
import { getStockReqByStockHandoverNoDal } from '../../dal/stockRequest/stockReq.dal'

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

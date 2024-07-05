import { Request, Response } from 'express'
import { getHandoverDataDal, handoverAcknowledgeDal } from '../../dal/hrms/stockHandover.dal'

export const getHandoverData = async (req: Request, res: Response) => {
	const result: any = await getHandoverDataDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Stock handover list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Stock handover list`,
			error: result?.message,
		})
	}
}

export const handoverAcknowledge = async (req: Request, res: Response) => {
	const result: any = await handoverAcknowledgeDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: result?.message || `Acknowledged successfully`,
		})
	} else {
		res.status(500).json({
			status: false,
			message: `Error while acknowledging`,
			error: result?.message,
		})
	}
}

import { Request, Response } from 'express'
import { getProcurementByProcurementNoDal, editProcurementDal } from '../../dal/procurement/procurement.dal'

export const getProcurementByProcurementNo = async (req: Request, res: Response) => {
	const result: any = await getProcurementByProcurementNoDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Procurement fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching procurement`,
			error: result?.message,
		})
	}
}

export const editProcurement = async (req: Request, res: Response) => {
	const result: any = await editProcurementDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Procurement updated`,
			data: result,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Stock request update failed`,
			error: result?.message,
		})
	}
}

import { Request, Response } from 'express'
import { getProcurementByProcurementNoDal, editProcurementDal, getInventoryAdditionValidityNoDal, editProcurementStockDal } from '../../dal/procurement/procurement.dal'

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

export const getInventoryAdditionValidityNo = async (req: Request, res: Response) => {
	const result: any = await getInventoryAdditionValidityNoDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Validity fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching validity`,
			error: result?.message,
		})
	}
}

export const editProcurementStock = async (req: Request, res: Response) => {
	const result: any = await editProcurementStockDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Updated successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while updating`,
			error: result?.message,
		})
	}
}

import { Request, Response } from 'express'
import { getStockReqInboxDal, getStockReqOutboxDal, forwardToIaDal, rejectStockReqDal, returnStockReqDal } from '../../dal/departmentalAdmin/daStockReq.dal'

export const getStockReqInbox = async (req: Request, res: Response) => {
	const result: any = await getStockReqInboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Stock request list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Stock request list`,
			error: result?.message,
		})
	}
}

export const getStockReqOutbox = async (req: Request, res: Response) => {
	const result: any = await getStockReqOutboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Stock request fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Stock request`,
			error: result?.message,
		})
	}
}

export const forwardToIa = async (req: Request, res: Response) => {
	const result: any = await forwardToIaDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Forwarded to IA successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while forwarding to IA`,
			error: result?.message,
		})
	}
}

export const rejectStockReq = async (req: Request, res: Response) => {
	const result: any = await rejectStockReqDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Rejected successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while rejecting`,
			error: result?.message,
		})
	}
}

export const returnStockReq = async (req: Request, res: Response) => {
	const result: any = await returnStockReqDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Returned successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while returning`,
			error: result?.message,
		})
	}
}

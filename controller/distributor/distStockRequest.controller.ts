import { Request, Response } from 'express'
import { createStockRequestDal, getStockReqInboxDal, getStockReqOutboxDal, forwardToSrDal, handoverDal, stockReturnDal, AddDeadStockDal } from '../../dal/distributor/distStockReq.dal'

export const createStockRequest = async (req: Request, res: Response) => {
	const result: any = await createStockRequestDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Stock request created having stock handover number : ${result?.stock_handover_no}`,
			stock_handover_no: result?.stock_handover_no,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Stock request creation failed`,
			error: result?.message,
		})
	}
}

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

export const forwardToSr = async (req: Request, res: Response) => {
	const result: any = await forwardToSrDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Forwarded to SR successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while forwarding to SR`,
			error: result?.message,
		})
	}
}

export const handover = async (req: Request, res: Response) => {
	const result: any = await handoverDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Handed over successfully`,
			data: result,
		})
	} else {
		res.status(500).json({
			status: false,
			message: `Error while handing over`,
			error: result?.message,
		})
	}
}

export const returnToInventory = async (req: Request, res: Response) => {
	const result: any = await stockReturnDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Forwarded to SR for approval successfully`,
			data: result,
		})
	} else {
		res.status(500).json({
			status: false,
			message: `Error while forwarding return request`,
			error: result?.message,
		})
	}
}

export const AddDeadStock = async (req: Request, res: Response) => {
	const result: any = await AddDeadStockDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Forwarded to SR for approval successfully`,
			data: result,
		})
	} else {
		res.status(500).json({
			status: false,
			message: `Error while forwarding dead stock request`,
			error: result?.message,
		})
	}
}

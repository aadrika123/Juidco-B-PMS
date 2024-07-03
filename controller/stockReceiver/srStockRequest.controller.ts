import { Request, Response } from 'express'
import { getStockReqInboxDal, getStockReqOutboxDal, approveStockReqDal, returnStockReqDal, rejectStockReqDal, stockReturnApprovalDal, deadStockApprovalDal, claimWarrantyDal } from '../../dal/stockReceiver/srStockReq.dal'

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

export const approveStockReq = async (req: Request, res: Response) => {
	const result: any = await approveStockReqDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Approved successfully`,
			data: result,
		})
	} else {
		res.status(500).json({
			status: false,
			message: `Error while approving`,
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
		res.status(500).json({
			status: false,
			message: `Error while returning`,
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
		res.status(500).json({
			status: false,
			message: `Error while rejecting`,
			error: result?.message,
		})
	}
}

export const stockReturnApproval = async (req: Request, res: Response) => {
	const result: any = await stockReturnApprovalDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Approved`,
			data: result,
		})
	} else {
		res.status(500).json({
			status: false,
			message: `Error while approving`,
			error: result?.message,
		})
	}
}

export const deadStockApproval = async (req: Request, res: Response) => {
	const result: any = await deadStockApprovalDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Approved`,
			data: result,
		})
	} else {
		res.status(500).json({
			status: false,
			message: `Error while approving`,
			error: result?.message,
		})
	}
}

export const claimWarranty = async (req: Request, res: Response) => {
	const result: any = await claimWarrantyDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Approved`,
			data: result,
		})
	} else {
		res.status(500).json({
			status: false,
			message: `Error while approving`,
			error: result?.message,
		})
	}
}

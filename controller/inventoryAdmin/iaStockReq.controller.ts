import { Request, Response } from 'express'
import { getStockReqInboxDal, getStockReqOutboxDal, approveStockReqDal, rejectStockReqDal, returnStockReqDal, getProductsBystockReqDal, unavailabilityNotificationDal } from '../../dal/inventoryAdmin/iaStockReq.dal'

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
		res.status(404).json({
			status: false,
			message: `Error while approving`,
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

export const getProductsBystockReq = async (req: Request, res: Response) => {
	const result: any = await getProductsBystockReqDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Product list fetched successfully`,
			// data: result?.data,
			// pagination: result?.pagination,
			data: result
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching product list`,
			error: result?.message,
		})
	}
}

export const unavailabilityNotification = async (req: Request, res: Response) => {
	const result: any = await unavailabilityNotificationDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `DA notified`,
			data: result
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while notifyiing`,
			error: result?.message,
		})
	}
}
import { Request, Response } from 'express'
import { getServiceReqInboxDal, getServiceReqOutboxDal, approveServiceRequestDal, rejectServiceRequestDal, returnServiceRequestDal } from '../../dal/inventoryAdmin/iaServiceReq.dal'

export const getServiceReqInbox = async (req: Request, res: Response) => {
	const result: any = await getServiceReqInboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Service request list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching service request list`,
			error: result?.message,
		})
	}
}

export const getServiceReqOutbox = async (req: Request, res: Response) => {
	const result: any = await getServiceReqOutboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Service request fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching service request`,
			error: result?.message,
		})
	}
}

export const approveServiceRequest = async (req: Request, res: Response) => {
	const result: any = await approveServiceRequestDal(req)
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

export const rejectServiceRequest = async (req: Request, res: Response) => {
	const result: any = await rejectServiceRequestDal(req)
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

export const returnServiceRequest = async (req: Request, res: Response) => {
	const result: any = await returnServiceRequestDal(req)
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

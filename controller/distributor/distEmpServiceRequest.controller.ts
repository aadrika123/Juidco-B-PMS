import { Request, Response } from 'express'
import { getEmpServiceReqInboxDal, getEmpServiceReqOutboxDal, approveEmpServiceRequestDal, rejectServiceRequestDal } from '../../dal/distributor/distEmpServiceReq.dal'

export const approveEmpServiceRequest = async (req: Request, res: Response) => {
	const result: any = await approveEmpServiceRequestDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Employee service request approved. Service number : ${result?.service_no} `
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Employee service request approval failed`,
			error: result?.message,
		})
	}
}

export const rejectServiceRequest = async (req: Request, res: Response) => {
	const result: any = await rejectServiceRequestDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Employee service request rejected. Service number : ${result?.service_no} `
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Employee service request rejection failed`,
			error: result?.message,
		})
	}
}

export const getEmpServiceReqInbox = async (req: Request, res: Response) => {
	const result: any = await getEmpServiceReqInboxDal(req)
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

export const getEmpServiceReqOutbox = async (req: Request, res: Response) => {
	const result: any = await getEmpServiceReqOutboxDal(req)
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

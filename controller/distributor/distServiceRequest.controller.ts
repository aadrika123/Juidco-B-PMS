import { Request, Response } from 'express'
import { createServiceRequestDal, getServiceReqInboxDal, getServiceReqOutboxDal } from '../../dal/distributor/distServiceReq.dal'

export const createServiceRequest = async (req: Request, res: Response) => {
	const result: any = await createServiceRequestDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Service request created having service number : ${result?.service_no}`,
			service_no: result?.service_no,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Service request creation failed`,
			error: result?.message,
		})
	}
}

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

import { Request, Response } from 'express'
import { createEmpServiceRequestDal, getServiceReqInboxDal, getServiceReqOutboxDal } from '../../dal/hrms/empService.dal'

export const getServiceReqInbox = async (req: Request, res: Response) => {
	const result: any = await getServiceReqInboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Employee service request list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching employee service request list`,
			error: result?.message,
		})
	}
}

export const getServiceReqOutbox = async (req: Request, res: Response) => {
	const result: any = await getServiceReqOutboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Employee service request list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching employee service request list`,
			error: result?.message,
		})
	}
}

export const createEmpServiceRequest = async (req: Request, res: Response) => {
	const result: any = await createEmpServiceRequestDal(req)
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

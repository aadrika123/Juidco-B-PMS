import { Request, Response } from 'express'
import { getServiceReqByServiceNoDal, editServiceRequestDal } from '../../dal/stockRequest/serviceReq.dal'

export const getServiceReqByServiceNo = async (req: Request, res: Response) => {
	const result: any = await getServiceReqByServiceNoDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Service request fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching service request`,
			error: result?.message,
		})
	}
}

export const editServiceRequest = async (req: Request, res: Response) => {
	const result: any = await editServiceRequestDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Service request Updated having service number : ${result?.service_no}`,
			stock_handover_no: result?.service_no,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Service request update failed`,
			error: result?.message,
		})
	}
}

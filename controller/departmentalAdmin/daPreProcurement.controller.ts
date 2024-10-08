import { Request, Response } from 'express'
import {
	getPreProcurementDal,
	getPreProcurementByIdDal,
	getPreProcurementByOrderNoDal,
	backToSrDal,
	editPreProcurementDal,
	releaseForTenderDal,
	releaseForTenderByProcNoDal,
	getPreProcurementOutboxDal,
	getPreProcurementOutboxByIdDal,
	rejectDal,
	rejectByProcurementNoDal,
	forwardToAccountantDal,
	getBoqInboxDal,
	getBoqOutboxDal,
	returnToAccountantDal,
	getPreTenderingInboxDal,
	getPreTenderingOutboxDal,
	rejectBoqDal,
	approveBoqForPtDal,
	approvePreTenderDal,
	rejectPreTenderDal,
	returnToAccPtDal,
	forwardToLevel1Dal,
	forwardToFinanceDal,
	proceedForPostProcurementDal
} from '../../dal/departmentalAdmin/daPreProcurement.dal'

export const getPreProcurement = async (req: Request, res: Response) => {
	const result: any = await getPreProcurementDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Pre procurement list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Pre procurement list`,
			error: result?.message,
		})
	}
}

export const getPreProcurementById = async (req: Request, res: Response) => {
	const result: any = await getPreProcurementByIdDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Pre procurement fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Pre procurement`,
			error: result?.message,
		})
	}
}

export const getPreProcurementByOrderNo = async (req: Request, res: Response) => {
	const result: any = await getPreProcurementByOrderNoDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Pre procurement fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Pre procurement`,
			error: result?.message,
		})
	}
}

export const backToSr = async (req: Request, res: Response) => {
	const result: any = await backToSrDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Back to SR successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while reversing to SR`,
			error: result?.message,
		})
	}
}

export const editPreProcurement = async (req: Request, res: Response) => {
	const result: any = await editPreProcurementDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Edit successful`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while editing`,
			error: result?.message,
		})
	}
}

export const releaseForTender = async (req: Request, res: Response) => {
	const result: any = await releaseForTenderDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Released for tender successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while releasing for tender`,
			error: result?.message,
		})
	}
}

export const releaseForTenderByProcNo = async (req: Request, res: Response) => {
	const result: any = await releaseForTenderByProcNoDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Released successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while releasing`,
			error: result?.message,
		})
	}
}

export const getPreProcurementOutbox = async (req: Request, res: Response) => {
	const result: any = await getPreProcurementOutboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Pre procurement outbox list for DA fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Pre procurement outbox list for DA`,
			error: result?.message,
		})
	}
}

export const getPreProcurementOutboxById = async (req: Request, res: Response) => {
	const result: any = await getPreProcurementOutboxByIdDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Pre procurement outbox for DA fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Pre procurement for DA`,
			error: result?.message,
		})
	}
}

export const reject = async (req: Request, res: Response) => {
	const result: any = await rejectDal(req)
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

export const rejectByProcurementNo = async (req: Request, res: Response) => {
	const result: any = await rejectByProcurementNoDal(req)
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

export const forwardToAccountant = async (req: Request, res: Response) => {
	const result: any = await forwardToAccountantDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Forwarded successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while forwarding`,
			error: result?.message,
		})
	}
}

export const getBoqInbox = async (req: Request, res: Response) => {
	const result: any = await getBoqInboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `BPQ list fetched`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching BOQ list`,
			error: result?.message,
		})
	}
}

export const getBoqOutbox = async (req: Request, res: Response) => {
	const result: any = await getBoqOutboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `BPQ list fetched`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching BOQ list`,
			error: result?.message,
		})
	}
}

export const forwardToFinance = async (req: Request, res: Response) => {
	const result: any = await forwardToFinanceDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Forwarded`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while forwarding`,
			error: result?.message,
		})
	}
}

export const proceedForPostProcurement = async (req: Request, res: Response) => {
	const result: any = await proceedForPostProcurementDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Forwarded`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while forwarding`,
			error: result?.message,
		})
	}
}

export const returnToAccountant = async (req: Request, res: Response) => {
	const result: any = await returnToAccountantDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `BPQ returned to accountant`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while returning BOQ`,
			error: result?.message,
		})
	}
}

export const getPreTenderingInbox = async (req: Request, res: Response) => {
	const result: any = await getPreTenderingInboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Pre tendering form list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Pre tendering form list`,
			error: result?.message,
		})
	}
}

export const getPreTenderingOutbox = async (req: Request, res: Response) => {
	const result: any = await getPreTenderingOutboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Pre tendering form list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Pre tendering form list`,
			error: result?.message,
		})
	}
}

export const rejectBoq = async (req: Request, res: Response) => {
	const result: any = await rejectBoqDal(req)
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

export const approveBoqForPt = async (req: Request, res: Response) => {
	const result: any = await approveBoqForPtDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Approved`,
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

export const approvePreTender = async (req: Request, res: Response) => {
	const result: any = await approvePreTenderDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Released`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while releasing`,
			error: result?.message,
		})
	}
}

export const rejectPreTender = async (req: Request, res: Response) => {
	const result: any = await rejectPreTenderDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Rejected`,
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

export const returnToAccPt = async (req: Request, res: Response) => {
	const result: any = await returnToAccPtDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Returned`,
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

//new flow with level 1 ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

export const forwardToLevel1 = async (req: Request, res: Response) => {
	const result: any = await forwardToLevel1Dal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Forwarded successfully`,
			data: result,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Error while forwarding`,
			error: result?.message,
		})
	}
}

//new flow with level 1 ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

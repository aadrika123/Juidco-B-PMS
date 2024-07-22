import { Request, Response } from 'express'
import { getBoqByRefNoDal, getBoqInboxDal, getBoqOutboxDal, approveBoqDal, returnBoqDal } from '../../dal/finance/finance.dal'

export const getBoqByRefNo = async (req: Request, res: Response) => {
	const result: any = await getBoqByRefNoDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `BOQ data fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching BOQ data`,
			error: result?.message,
		})
	}
}

export const getBoqInbox = async (req: Request, res: Response) => {
	const result: any = await getBoqInboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `BOQ list fetched successfully`,
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
			message: `BOQ list fetched successfully`,
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

export const approveBoq = async (req: Request, res: Response) => {
	const result: any = await approveBoqDal(req)
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

export const returnBoq = async (req: Request, res: Response) => {
	const result: any = await returnBoqDal(req)
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

import { Request, Response } from 'express'
import { getInboxDal, getOutboxDal, returnToLevel1Dal, approvalByLevel2Dal, rejectionByLevel2Dal } from '../../dal/level2/level2.dal'

export const getInbox = async (req: Request, res: Response) => {
	const result: any = await getInboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Procurement list fetched`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching procurement`,
			error: result?.message,
		})
	}
}

export const getOutbox = async (req: Request, res: Response) => {
	const result: any = await getOutboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Procurement list fetched`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching procurement`,
			error: result?.message,
		})
	}
}

export const returnToLevel1 = async (req: Request, res: Response) => {
	const result: any = await returnToLevel1Dal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Procurement tender returned`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while returning procurement`,
			error: result?.message,
		})
	}
}

export const rejectionByLevel2 = async (req: Request, res: Response) => {
	const result: any = await rejectionByLevel2Dal(req)
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

export const approvalByLevel2 = async (req: Request, res: Response) => {
	const result: any = await approvalByLevel2Dal(req)
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

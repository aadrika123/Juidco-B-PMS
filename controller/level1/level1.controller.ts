import { Request, Response } from 'express'
import { getBoqInboxDal, getBoqOutboxDal, forwardToLevel2Dal, returnToDaDal, approvalByLevel1Dal, rejectionByLevel1Dal } from '../../dal/level1/level1.dal'

export const forwardToLevel2 = async (req: Request, res: Response) => {
	const result: any = await forwardToLevel2Dal(req)
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
			message: `BPQ and pre tender list fetched`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching BOQ and pre tender list`,
			error: result?.message,
		})
	}
}

export const getBoqOutbox = async (req: Request, res: Response) => {
	const result: any = await getBoqOutboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `BPQ and pre tender list fetched`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching BOQ and pre tender list`,
			error: result?.message,
		})
	}
}

export const returnToDa = async (req: Request, res: Response) => {
	const result: any = await returnToDaDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `BPQ and pre tender returned`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while returning BOQ and pre tender`,
			error: result?.message,
		})
	}
}

export const rejectionByLevel1 = async (req: Request, res: Response) => {
	const result: any = await rejectionByLevel1Dal(req)
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

export const approvalByLevel1 = async (req: Request, res: Response) => {
	const result: any = await approvalByLevel1Dal(req)
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

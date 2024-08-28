import { Request, Response } from 'express'
import { createBankDal, getBankByIdDal, getBankDal, editBankDal, switchStatusDal, getBankActiveOnlyDal } from '../../dal/masterEntry/bank.dal'

export const createBank = async (req: Request, res: Response) => {
	const result: any = await createBankDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Bank created having id : ${result.id}`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Bank creation failed`,
			error: result?.message,
		})
	}
}

export const getBank = async (req: Request, res: Response) => {
	const result: any = await getBankDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Bank list fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching bank list`,
			error: result?.message,
		})
	}
}

export const getBankById = async (req: Request, res: Response) => {
	const result: any = await getBankByIdDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Bank fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching bank`,
			error: result?.message,
		})
	}
}

export const getBankActiveOnly = async (req: Request, res: Response) => {
	const result: any = await getBankActiveOnlyDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Active bank list fetched successfully`,
			data: result,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Error while fetching bank`,
			error: result?.message,
		})
	}
}

export const editBank = async (req: Request, res: Response) => {
	const result: any = await editBankDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Bank updated having id : ${result.id}`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Bank update failed`,
			error: result?.message,
		})
	}
}

export const switchStatus = async (req: Request, res: Response) => {
	const result: any = await switchStatusDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Status switched`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Status switch failed`,
			error: result?.message,
		})
	}
}
import { Request, Response } from 'express'
import { createUnitDal, getUnitByIdDal, getUnitDal, editUnitDal, switchStatusDal, getUnitActiveOnlyDal } from '../../dal/masterEntry/unit.dal'

export const createUnit = async (req: Request, res: Response) => {
	const result: any = await createUnitDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Unit created having id : ${result.id}`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Unit creation failed`,
			error: result?.message,
		})
	}
}

export const getUnit = async (req: Request, res: Response) => {
	const result: any = await getUnitDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Unit list fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching unit list`,
			error: result?.message,
		})
	}
}

export const getUnitById = async (req: Request, res: Response) => {
	const result: any = await getUnitByIdDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Unit fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching unit`,
			error: result?.message,
		})
	}
}

export const getUnitActiveOnly = async (req: Request, res: Response) => {
	const result: any = await getUnitActiveOnlyDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Active unit list fetched successfully`,
			data: result,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Error while fetching unit`,
			error: result?.message,
		})
	}
}

export const editUnit = async (req: Request, res: Response) => {
	const result: any = await editUnitDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Unit updated having id : ${result.id}`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Unit update failed`,
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

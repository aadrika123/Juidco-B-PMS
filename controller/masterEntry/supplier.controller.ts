import { Request, Response } from 'express'
import { createSupplierDal, getSupplierByIdDal, getSupplierDal, editSupplierDal, switchStatusDal, getSupplierActiveOnlyDal } from '../../dal/masterEntry/supplier.dal'

export const createSupplier = async (req: Request, res: Response) => {
	const result: any = await createSupplierDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Supplier created having id : ${result.id}`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Supplier creation failed`,
			error: result?.message,
		})
	}
}

export const getSupplier = async (req: Request, res: Response) => {
	const result: any = await getSupplierDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Supplier list fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching supplier list`,
			error: result?.message,
		})
	}
}

export const getSupplierById = async (req: Request, res: Response) => {
	const result: any = await getSupplierByIdDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Supplier fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching supplier`,
			error: result?.message,
		})
	}
}

export const getSupplierActiveOnly = async (req: Request, res: Response) => {
	const result: any = await getSupplierActiveOnlyDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Active supplier list fetched successfully`,
			data: result,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Error while fetching supplier`,
			error: result?.message,
		})
	}
}

export const editSupplier = async (req: Request, res: Response) => {
	const result: any = await editSupplierDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Supplier updated having id : ${result.id}`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Supplier update failed`,
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

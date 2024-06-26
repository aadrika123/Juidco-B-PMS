import { Request, Response } from 'express'
import { createSubcategoryDal, getSubcategoryDal, getSubcategoryByCategoryIdDal, getSubcategoryActiveOnlyDal, switchStatusDal, editSubcategoryDal, getSubcategoryByCategoryIdActiveOnlyDal } from '../../dal/masterEntry/subcategory.dal'

export const createSubCategory = async (req: Request, res: Response) => {
	const result: any = await createSubcategoryDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Sub category created having id : ${result.id}`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Subcategory creation failed`,
			error: result?.message,
		})
	}
}

export const getSubcategory = async (req: Request, res: Response) => {
	const result: any = await getSubcategoryDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Subcategory list fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching subcategory list`,
			error: result?.message,
		})
	}
}

export const getSubcategoryByCategoryId = async (req: Request, res: Response) => {
	const result: any = await getSubcategoryByCategoryIdDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Subcategory fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching subcategory`,
			error: result?.message,
		})
	}
}

export const getSubcategoryByCategoryIdActiveOnly = async (req: Request, res: Response) => {
	const result: any = await getSubcategoryByCategoryIdActiveOnlyDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Active subcategory fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching active subcategory`,
			error: result?.message,
		})
	}
}

export const getSubcategoryActiveOnly = async (req: Request, res: Response) => {
	const result: any = await getSubcategoryActiveOnlyDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Active subcategory list fetched successfully`,
			data: result,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Error while fetching active subcategory`,
			error: result?.message,
		})
	}
}

export const editSubcategory = async (req: Request, res: Response) => {
	const result: any = await editSubcategoryDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Subcategory updated having id : ${result.id}`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Subcategory update failed`,
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

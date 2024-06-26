import { Request, Response } from 'express'
import { createCategoryDal, getCategoryByIdDal, getCategoryDal, editCategoryDal, switchStatusDal, getCategoryActiveOnlyDal } from '../../dal/masterEntry/category.dal'

export const createCategory = async (req: Request, res: Response) => {
	const result: any = await createCategoryDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Category created having id : ${result.id}`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Category creation failed`,
			error: result?.message,
		})
	}
}

export const getCategory = async (req: Request, res: Response) => {
	const result: any = await getCategoryDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Category list fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching category list`,
			error: result?.message,
		})
	}
}

export const getCategoryById = async (req: Request, res: Response) => {
	const result: any = await getCategoryByIdDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Category fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching category`,
			error: result?.message,
		})
	}
}

export const getCategoryActiveOnly = async (req: Request, res: Response) => {
	const result: any = await getCategoryActiveOnlyDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Active category list fetched successfully`,
			data: result,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Category update failed`,
			error: result?.message,
		})
	}
}

export const editCategory = async (req: Request, res: Response) => {
	const result: any = await editCategoryDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Category updated having id : ${result.id}`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Category update failed`,
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

import { Request, Response } from 'express'
import { createItemDal, getItemDal, getItemByFilterDal, getItemBySubcategoryBrandDal, getQuantityByItemIdDal, getItemByIdDal } from '../../dal/inventory/inventory.dal'

export const createItem = async (req: Request, res: Response) => {
	const result: any = await createItemDal(req)
	if (!result?.error) {
		res.status(201).json({
			status: true,
			message: `Item created having id : ${result.id}`,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Item creation failed`,
			error: result?.message,
		})
	}
}

export const getItem = async (req: Request, res: Response) => {
	const result: any = await getItemDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Item list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching item list`,
			error: result?.message,
		})
	}
}

export const getItemByFilter = async (req: Request, res: Response) => {
	const result: any = await getItemByFilterDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Item list fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching item list`,
			error: result?.message,
		})
	}
}

export const getItemBySubcategoryBrand = async (req: Request, res: Response) => {
	const result: any = await getItemBySubcategoryBrandDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Item list fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching item list`,
			error: result?.message,
		})
	}
}

export const getQuantityByItemId = async (req: Request, res: Response) => {
	const result: any = await getQuantityByItemIdDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Item quantity fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching item quantity`,
			error: result?.message,
		})
	}
}

export const getItemById = async (req: Request, res: Response) => {
	const result: any = await getItemByIdDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Item fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching item`,
			error: result?.message,
		})
	}
}



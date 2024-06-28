import { Request, Response } from 'express'
import { getReceivedInventoryDal, getReceivedInventoryByIdDal, getReceivedInventoryByOrderNoDal, getReceivedInventoryOutboxDal, getReceivedInventoryOutboxByIdDal, addToInventoryDal, addProductDal } from '../../dal/stockReceiver/srReceivedInventory.dal'

export const getReceivedInventory = async (req: Request, res: Response) => {
	const result: any = await getReceivedInventoryDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Received Inventory list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Received Inventory list`,
			error: result?.message,
		})
	}
}

export const getReceivedInventoryById = async (req: Request, res: Response) => {
	const result: any = await getReceivedInventoryByIdDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Received Inventory fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Received Inventory`,
			error: result?.message,
		})
	}
}

export const getReceivedInventoryByOrderNo = async (req: Request, res: Response) => {
	const result: any = await getReceivedInventoryByOrderNoDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Received Inventory fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Received Inventory`,
			error: result?.message,
		})
	}
}

export const getReceivedInventoryOutbox = async (req: Request, res: Response) => {
	const result: any = await getReceivedInventoryOutboxDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Received Inventory list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Received Inventory list`,
			error: result?.message,
		})
	}
}

export const getReceivedInventoryOutboxById = async (req: Request, res: Response) => {
	const result: any = await getReceivedInventoryOutboxByIdDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Received Inventory fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching Received Inventory`,
			error: result?.message,
		})
	}
}

export const addToInventory = async (req: Request, res: Response) => {
	const result: any = await addToInventoryDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Added to Inventory successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while adding`,
			error: result?.message,
		})
	}
}

export const addProduct = async (req: Request, res: Response) => {
	const result: any = await addProductDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Product added successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while adding`,
			error: result?.message,
		})
	}
}

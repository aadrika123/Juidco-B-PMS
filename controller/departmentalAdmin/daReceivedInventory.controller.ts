import { Request, Response } from "express";
import {
    getReceivedInventoryDal,
    getReceivedInventoryByIdDal,
    getReceivedInventoryByOrderNoDal,
    createReceivingDal,
    getReceivedInventoryOutboxDal
} from "../../dal/departmentalAdmin/daReceivedInventory.dal";



export const getReceivedInventory = async (req: Request, res: Response) => {
    const result: any = await getReceivedInventoryDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Received Inventory list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Received Inventory list`,
            error: result?.message
        })
    }
}


export const getReceivedInventoryById = async (req: Request, res: Response) => {
    const result: any = await getReceivedInventoryByIdDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Received Inventory fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Received Inventory`,
            error: result?.message
        })
    }
}


export const getReceivedInventoryByOrderNo = async (req: Request, res: Response) => {
    const result: any = await getReceivedInventoryByOrderNoDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Received Inventory fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Received Inventory`,
            error: result?.message
        })
    }
}


export const createReceiving = async (req: Request, res: Response) => {
    const result: any = await createReceivingDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Receiving created successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while creating receiving`,
            error: result?.message
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
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Received Inventory list`,
            error: result?.message
        })
    }
}

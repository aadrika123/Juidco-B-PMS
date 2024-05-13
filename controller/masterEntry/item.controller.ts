import { Request, Response } from "express";
import { createItemDal, getItemByIdDal, getItemDal } from "../../dal/masterEntry/item.dal";


export const createItem = async (req: Request, res: Response) => {
    const result: any = await createItemDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Item created having id : ${result.id}`
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Item creation failed`,
            error: result?.message
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
            error: result?.message
        })
    }
}


export const getItemyById = async (req: Request, res: Response) => {
    const result: any = await getItemByIdDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Item fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching item`,
            error: result?.message
        })
    }
}
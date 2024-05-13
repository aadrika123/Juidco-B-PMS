import { Request, Response } from "express";
import { createGraphicsDal, getGraphicsDal } from "../../dal/masterEntry/graphics.dal";


export const createGraphics = async (req: Request, res: Response) => {
    const result: any = await createGraphicsDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Graphics created having id : ${result.id}`
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Graphics creation failed`,
            error: result?.message
        })
    }
}


export const getGraphics = async (req: Request, res: Response) => {
    const result: any = await getGraphicsDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Graphics list fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching graphics list`,
            error: result?.message
        })
    }
}
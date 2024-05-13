import { Request, Response } from "express";
import { createOsDal, getOsDal } from "../../dal/masterEntry/os.dal";


export const createOs = async (req: Request, res: Response) => {
    const result: any = await createOsDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `OS created having id : ${result.id}`
        })
    } else {
        res.status(400).json({
            status: false,
            message: `OS creation failed`,
            error: result?.message
        })
    }
}


export const getOs = async (req: Request, res: Response) => {
    const result: any = await getOsDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `OS list fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching OS list`,
            error: result?.message
        })
    }
}
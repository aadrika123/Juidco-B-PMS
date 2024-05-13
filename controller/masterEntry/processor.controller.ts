import { Request, Response } from "express";
import { createProcessorDal, getProcessorDal } from "../../dal/masterEntry/processor.dal";



export const createProcessor = async (req: Request, res: Response) => {
    const result: any = await createProcessorDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Brand created having id : ${result.id}`
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Brand creation failed`,
            error: result?.message
        })
    }
}


export const getProcessor = async (req: Request, res: Response) => {
    const result: any = await getProcessorDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Brand list fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching brand list`,
            error: result?.message
        })
    }
}
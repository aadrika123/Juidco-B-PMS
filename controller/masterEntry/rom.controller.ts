import { Request, Response } from "express";
import { createRomDal, getRomDal } from "../../dal/masterEntry/rom.dal";


export const createRom = async (req: Request, res: Response) => {
    const result: any = await createRomDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `ROM created having id : ${result.id}`
        })
    } else {
        res.status(400).json({
            status: false,
            message: `ROM creation failed`,
            error: result?.message
        })
    }
}


export const getRom = async (req: Request, res: Response) => {
    const result: any = await getRomDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `ROM list fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Rom list`,
            error: result?.message
        })
    }
}
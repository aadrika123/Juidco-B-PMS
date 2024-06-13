import { Request, Response } from "express";
import {
    getPreTenderDal,
} from "../../dal/preTender/preTender.dal";


export const getPreTender = async (req: Request, res: Response) => {
    const result: any = await getPreTenderDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre tender fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching pre tender`,
            error: result?.message
        })
    }
}
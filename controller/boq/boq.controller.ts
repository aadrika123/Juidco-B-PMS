import { Request, Response } from "express";
import {
    getBoqByRefNoDal
} from "../../dal/boq/boq.dal";


export const getBoqByRefNo = async (req: Request, res: Response) => {
    const result: any = await getBoqByRefNoDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `BOQ fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching BOQ`,
            error: result?.message
        })
    }
}
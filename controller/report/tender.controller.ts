import { Request, Response } from "express";
import {
    getTenderReportDal
} from "../../dal/report/tender.dal";


export const getTenderReport = async (req: Request, res: Response) => {
    const result: any = await getTenderReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Tender report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching tender reportt`,
            error: result?.message,
        })
    }
}

import { Request, Response } from "express";
import {
    getTaTenderReportDal
} from "../../../../dal/report/levelWiseReport/ta/taReport.dal";


export const getTaTenderReport = async (req: Request, res: Response) => {
    const result: any = await getTaTenderReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `TA tender report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching TA tender report`,
            error: result?.message,
        })
    }
}
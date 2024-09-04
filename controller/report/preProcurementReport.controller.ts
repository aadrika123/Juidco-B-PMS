import { Request, Response } from "express";
import {
    getPreProcurementReportDal
} from "../../dal/report/preProcurementReport.dal";


export const getPreProcurementReport = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching pre procurement report`,
            error: result?.message,
        })
    }
}
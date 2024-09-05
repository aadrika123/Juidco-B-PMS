import { Request, Response } from "express";
import {
    getPostProcurementReportDal
} from "../../dal/report/postProcurementReport.dal";


export const getPostProcurementReport = async (req: Request, res: Response) => {
    const result: any = await getPostProcurementReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Post procurement report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching post procurement report`,
            error: result?.message,
        })
    }
}
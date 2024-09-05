import { Request, Response } from "express";
import {
    getDaStockReqReportDal,
    getDaServiceReqReportDal
} from "../../../../dal/report/levelWiseReport/da/daReport.dal";


export const getDaStockReqReport = async (req: Request, res: Response) => {
    const result: any = await getDaStockReqReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `DA stock report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching DA stock report`,
            error: result?.message,
        })
    }
}

export const getDaServiceReqReport = async (req: Request, res: Response) => {
    const result: any = await getDaServiceReqReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `DA service report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching DA service report`,
            error: result?.message,
        })
    }
}
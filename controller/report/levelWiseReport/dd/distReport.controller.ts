import { Request, Response } from "express";
import {
    getDistStockReqReportDal,
    getDistServiceReqReportDal
} from "../../../../dal/report/levelWiseReport/dd/distReport.dal";


export const getDistStockReqReport = async (req: Request, res: Response) => {
    const result: any = await getDistStockReqReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Distributor stock report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching distributor stock report`,
            error: result?.message,
        })
    }
}

export const getDistServiceReqReport = async (req: Request, res: Response) => {
    const result: any = await getDistServiceReqReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Distributor service report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching distributor service report`,
            error: result?.message,
        })
    }
}
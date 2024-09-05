import { Request, Response } from "express";
import {
    getIaStockReqReportDal,
    getIaServiceReqReportDal
} from "../../../../dal/report/levelWiseReport/ia/iaReport.dal";


export const getIaStockReqReport = async (req: Request, res: Response) => {
    const result: any = await getIaStockReqReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `IA stock report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching IA stock report`,
            error: result?.message,
        })
    }
}

export const getIaServiceReqReport = async (req: Request, res: Response) => {
    const result: any = await getIaServiceReqReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `IA service report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching IA service report`,
            error: result?.message,
        })
    }
}
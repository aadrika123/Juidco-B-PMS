import { Request, Response } from "express";
import {
    getIaStockReqReportDal,
    getIaServiceReqReportDal,
    getIaProcurementReportDal,
    getIaBoqReportDal,
    getIaTenderReportDal
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

export const getIaProcurementReport = async (req: Request, res: Response) => {
    const result: any = await getIaProcurementReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `IA procurement report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching IA procurement report`,
            error: result?.message,
        })
    }
}

export const getIaBoqReport = async (req: Request, res: Response) => {
    const result: any = await getIaBoqReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `IA BOQ report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching IA BOQ report`,
            error: result?.message,
        })
    }
}

export const getIaTenderReport = async (req: Request, res: Response) => {
    const result: any = await getIaTenderReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `IA tender report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching IA tender report`,
            error: result?.message,
        })
    }
}
import { Request, Response } from "express";
import {
    getStockListDal,
    getStockHistoryDal
} from "../../dal/report/stockHistory.dal";


export const getStockList = async (req: Request, res: Response) => {
    const result: any = await getStockListDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Stock list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching stock list`,
            error: result?.message,
        })
    }
}

export const getStockHistory = async (req: Request, res: Response) => {
    const result: any = await getStockHistoryDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Stock history fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching stock history`,
            error: result?.message,
        })
    }
}

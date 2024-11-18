import { Request, Response } from "express";
import {
    getTotalStocksDal,
    getDeadStocksDal,
    getStockMovementDal,
    getTotalRemainingStocksDal,
    getProcurementStocksDal
} from "../../dal/report/inventoryReport.dal";


export const getTotalStocks = async (req: Request, res: Response) => {
    const result: any = await getTotalStocksDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Total stocks fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching total stocks`,
            error: result?.message,
        })
    }
}


export const getProcurementStocks = async (req: Request, res: Response) => {
    const result: any = await getProcurementStocksDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Total stocks fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching total stocks`,
            error: result?.message,
        })
    }
}


export const getTotalRemainingStocks = async (req: Request, res: Response) => {
    const result: any = await getTotalRemainingStocksDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Total stocks fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching total stocks`,
            error: result?.message,
        })
    }
}

export const getDeadStocks = async (req: Request, res: Response) => {
    const result: any = await getDeadStocksDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Dead stocks fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching dead stocks`,
            error: result?.message,
        })
    }
}

export const getStockMovement = async (req: Request, res: Response) => {
    const result: any = await getStockMovementDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Stocks in movement fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching stocks in movement`,
            error: result?.message,
        })
    }
}
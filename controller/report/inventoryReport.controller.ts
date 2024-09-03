import { Request, Response } from "express";
import {
    getTotalStocksDal
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

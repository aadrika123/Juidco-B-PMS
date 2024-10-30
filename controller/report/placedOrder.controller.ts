import { Request, Response } from "express";
import {
    getPlacedOrderReportDal
} from "../../dal/report/placedOrder.dal";


export const getPlacedOrderReport = async (req: Request, res: Response) => {
    const result: any = await getPlacedOrderReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Placed order report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching placed order report`,
            error: result?.message,
        })
    }
}

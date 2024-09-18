import { Request, Response } from "express";
import {
    getInventoryDashboardDal
} from "../../dal/dashboard/inventoryDashboard.dal";


export const getDistDashboard = async (req: Request, res: Response) => {
    try {
        const result: any = await getInventoryDashboardDal()
        res.status(200).json({
            status: true,
            message: `Distributor dashboard data fetched successfully`,
            data: result
        })
    } catch (err: any) {
        res.status(404).json({
            status: false,
            message: `Error while fetching distributor dashboard data`,
            error: err?.message
        })
    }
}

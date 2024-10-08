import { Request, Response } from "express";
import {
    getInventoryDashboardDal,
    getAssignedStocksDal,
} from "../../dal/dashboard/inventoryDashboard.dal";
import { getDistCountsDal } from "../../dal/dashboard/distDashboard.dal";


export const getDistDashboard = async (req: Request, res: Response) => {
    try {
        const returnData = await getInventoryDashboardDal('return')
        const deadData = await getInventoryDashboardDal('dead')
        const assignedData = await getAssignedStocksDal()
        const counts = await getDistCountsDal()
        res.status(200).json({
            status: true,
            message: `Distributor dashboard data fetched successfully`,
            data: {
                graph: { returnData, deadData, assignedData },
                counts
            }
        })
    } catch (err: any) {
        res.status(404).json({
            status: false,
            message: `Error while fetching distributor dashboard data`,
            error: err?.message
        })
    }
}

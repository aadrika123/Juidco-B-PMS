import { Request, Response } from "express";
import {
    getInventoryDashboardDal,
    getAssignedStocksDal,
    getCountsDal
} from "../../dal/dashboard/inventoryDashboard.dal";


export const getIaDashboard = async (req: Request, res: Response) => {
    try {
        const returnData = await getInventoryDashboardDal('return')
        const deadData = await getInventoryDashboardDal('dead')
        const assignedData = await getAssignedStocksDal()
        const counts = await getCountsDal()
        res.status(200).json({
            status: true,
            message: `IA dashboard data fetched successfully`,
            data: {
                graph: { returnData, deadData, assignedData },
                counts
            }
        })
    } catch (err: any) {
        res.status(404).json({
            status: false,
            message: `Error while fetching IA dashboard data`,
            error: err?.message
        })
    }
}

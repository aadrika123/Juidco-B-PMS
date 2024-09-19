import { Request, Response } from "express";
import { getTenderCountsDal } from "../../dal/dashboard/tenderDashboard.dal";


export const getTenderDashboard = async (req: Request, res: Response) => {
    try {
        const counts = await getTenderCountsDal()
        res.status(200).json({
            status: true,
            message: `Tender data fetched successfully`,
            data: {
                counts
            }
        })
    } catch (err: any) {
        res.status(404).json({
            status: false,
            message: `Error while fetching tender dashboard data`,
            error: err?.message
        })
    }
}

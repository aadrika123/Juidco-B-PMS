import { Request, Response } from "express";
import { getLevelCountsDal } from "../../dal/dashboard/levelDashboard.dal";


export const getLevelDashboard = async (req: Request, res: Response) => {
    try {
        const counts = await getLevelCountsDal()
        res.status(200).json({
            status: true,
            message: `Level data fetched successfully`,
            data: {
                counts
            }
        })
    } catch (err: any) {
        res.status(404).json({
            status: false,
            message: `Error while fetching level dashboard data`,
            error: err?.message
        })
    }
}

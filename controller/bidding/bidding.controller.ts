import { Request, Response } from "express";
import {
    getBidDetailsDal
} from "../../dal/bidding/bidding.dal";


export const getBidDetails = async (req: Request, res: Response) => {
    const result: any = await getBidDetailsDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Bid details fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching bid details`,
            error: result?.message
        })
    }
}

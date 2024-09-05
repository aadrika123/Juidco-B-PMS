import { Request, Response } from "express";
import {
    getLevel2ProcurementReportDal
} from "../../../../dal/report/levelWiseReport/level2/level2Report.dal";


export const getLevel2ProcurementReport = async (req: Request, res: Response) => {
    const result: any = await getLevel2ProcurementReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Level 2 procurement report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching level 2 procurement report`,
            error: result?.message,
        })
    }
}
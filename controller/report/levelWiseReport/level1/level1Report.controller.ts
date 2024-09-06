import { Request, Response } from "express";
import {

    getLevel1ProcurementReportDal
} from "../../../../dal/report/levelWiseReport/level1/level1Report.dal";


export const getLevel1ProcurementReport = async (req: Request, res: Response) => {
    const result: any = await getLevel1ProcurementReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Level 1 procurement report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching level 1 procurement report`,
            error: result?.message,
        })
    }
}
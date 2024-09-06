import { Request, Response } from "express";
import {
    getFinanceBoqReportDal
} from "../../../../dal/report/levelWiseReport/finance/financeReport.dal";


export const getFinanceBoqReport = async (req: Request, res: Response) => {
    const result: any = await getFinanceBoqReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Finance BOQ report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching finance BOQ report`,
            error: result?.message,
        })
    }
}
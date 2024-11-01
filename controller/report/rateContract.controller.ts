import { Request, Response } from "express";
import {
    getRateContractReportDal
} from "../../dal/report/rateContract.dal";


export const getRateContractReport = async (req: Request, res: Response) => {
    const result: any = await getRateContractReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Rate contract report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching rate contract report`,
            error: result?.message,
        })
    }
}

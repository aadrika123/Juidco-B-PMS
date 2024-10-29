import { Request, Response } from "express";
import {
    getWarrantyReportDal
} from "../../dal/report/warranty.dal";


export const getWarrantyReport = async (req: Request, res: Response) => {
    const result: any = await getWarrantyReportDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Warranty report fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching warranty reportt`,
            error: result?.message,
        })
    }
}

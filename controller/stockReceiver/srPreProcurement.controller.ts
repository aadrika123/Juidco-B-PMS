import { Request, Response } from "express";
import { createPreProcurementDal, getPreProcurementDal, getPreProcurementByIdDal, getPreProcurementByOrderNoDal } from "../../dal/stockReceiver/preProcurement.dal";


export const createPreProcurement = async (req: Request, res: Response) => {
    const result: any = await createPreProcurementDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Pre procurement created having id : ${result.id}`,
            order_no: result?.order_no
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Pre procurement creation failed`,
            error: result?.message
        })
    }
}


export const getPreProcurement = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement list`,
            error: result?.message
        })
    }
}


export const getPreProcurementById = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementByIdDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement`,
            error: result?.message
        })
    }
}


export const getPreProcurementByOrderNo = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementByOrderNoDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement`,
            error: result?.message
        })
    }
}
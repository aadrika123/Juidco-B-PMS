import { Request, Response } from "express";
import {
    getPostProcurementDal,
    getPostProcurementByIdDal,
    getPostProcurementByOrderNoDal,
    SaveAdditionalDetailsProcurementDal,
    getPostProcurementOutboxDal,
    getPostProcurementOutboxByIdDal,
} from "../../dal/departmentalAdmin/daPostProcurement.dal";



export const getPostProcurement = async (req: Request, res: Response) => {
    const result: any = await getPostProcurementDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Post procurement list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Post procurement list`,
            error: result?.message
        })
    }
}


export const getPostProcurementById = async (req: Request, res: Response) => {
    const result: any = await getPostProcurementByIdDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Post procurement fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Post procurement`,
            error: result?.message
        })
    }
}


export const getPostProcurementByOrderNo = async (req: Request, res: Response) => {
    const result: any = await getPostProcurementByOrderNoDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Post procurement fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Post procurement`,
            error: result?.message
        })
    }
}


export const SaveAdditionalDetailsProcurement = async (req: Request, res: Response) => {
    const result: any = await SaveAdditionalDetailsProcurementDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Additional Details Saved`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while saving additional details`,
            error: result?.message
        })
    }
}


export const getPostProcurementOutbox = async (req: Request, res: Response) => {
    const result: any = await getPostProcurementOutboxDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Post procurement outbox list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Post procurement list`,
            error: result?.message
        })
    }
}


export const getPostProcurementOutboxById = async (req: Request, res: Response) => {
    const result: any = await getPostProcurementOutboxByIdDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Post procurement outbox fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Post procurement outbox`,
            error: result?.message
        })
    }
}

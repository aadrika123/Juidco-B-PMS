import { Request, Response } from "express";
import {
    getPreProcurementDal,
    getPreProcurementByIdDal,
    getPreProcurementByOrderNoDal,
    backToSrDal,
    editPreProcurementDal,
    releaseForTenderDal,
    getPreProcurementOutboxDal,
    getPreProcurementOutboxtByIdDal,
    rejectDal
} from "../../dal/departmentalAdmin/daPreProcurement.dal";



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


export const backToSr = async (req: Request, res: Response) => {
    const result: any = await backToSrDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Back to SR successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while reversing to SR`,
            error: result?.message
        })
    }
}

export const editPreProcurement = async (req: Request, res: Response) => {
    const result: any = await editPreProcurementDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Edit successfull`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while editing`,
            error: result?.message
        })
    }
}

export const releaseForTender = async (req: Request, res: Response) => {
    const result: any = await releaseForTenderDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Released for tender successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while releasing for tender`,
            error: result?.message
        })
    }
}


export const getPreProcurementOutbox = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementOutboxDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement outbox list for DA fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement outbox list for DA`,
            error: result?.message
        })
    }
}


export const getPreProcurementOutboxById = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementOutboxtByIdDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement outbox for DA fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement for DA`,
            error: result?.message
        })
    }
}


export const reject = async (req: Request, res: Response) => {
    const result: any = await rejectDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Rejected successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while rejecting`,
            error: result?.message
        })
    }
}
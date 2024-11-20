import { Request, Response } from "express";
import {
    createPreProcurementDal,
    getPreProcurementDal,
    getPreProcurementByIdDal,
    getPreProcurementByOrderNoDal,
    forwardToDaDal,
    getPreProcurementOutboxDal,
    getPreProcurementOutboxByIdDal,
    getPreProcurementRejectedDal,
    getPreProcurementReleasedDal,
    editPreProcurementDal,
    forwardToLevel1Dal,
    getInventoryDatatDal,
    getInventoryByHandoverNoAndId
} from "../../dal/stockReceiver/preProcurement.dal";



export const createPreProcurement = async (req: Request, res: Response) => {
    const result: any = await createPreProcurementDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Pre procurement created having Procurement number : ${result?.procurement_no}`,
            procurement_no: result?.procurement_no
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

export const getInventoryData = async (req: Request, res: Response) => {
    const result: any = await getInventoryDatatDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Inventory list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Inventory list`,
            error: result?.message
        })
    }
}


export const getInventoryByHandoverNo = async (req: Request, res: Response) => {
    const result: any = await getInventoryByHandoverNoAndId(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Inventory Data by ID fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Inventory  Data by ID`,
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



export const forwardToDa = async (req: Request, res: Response) => {
    const result: any = await forwardToDaDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Forwarded to DA successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while forwarding to DA`,
            error: result?.message
        })
    }
}


export const forwardToLevel1 = async (req: Request, res: Response) => {
    const result: any = await forwardToLevel1Dal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Forwarded to Level 1 successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while forwarding to level 1`,
            error: result?.message
        })
    }
}



export const getPreProcurementOutbox = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementOutboxDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement outbox list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement outbox list`,
            error: result?.message
        })
    }
}



export const getPreProcurementOutboxById = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementOutboxByIdDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement outbox fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement outbox`,
            error: result?.message
        })
    }
}



export const getPreProcurementRejected = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementRejectedDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Rejected Pre procurement list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching rejected Pre procurement list`,
            error: result?.message
        })
    }
}



export const getPreProcurementReleased = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementReleasedDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Released Pre procurement list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching released Pre procurement list`,
            error: result?.message
        })
    }
}



export const editPreProcurement = async (req: Request, res: Response) => {
    const result: any = await editPreProcurementDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Edit successful`,
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
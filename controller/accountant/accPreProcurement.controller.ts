import { Request, Response } from "express";
import {
    getPreProcurementDal,
    getPreProcurementBulkByOrderNoDal,
    createBoqDal,
    getPreProcurementForBoqDal,
    getBoqInboxDal,
    getBoqOutboxDal,
    getPreProcurementOutboxDal,
    forwardToDaDal,
    getPreTenderingInboxDal,
    createBasicDetailsPtDal
} from "../../dal/accountant/accPreProcurement.dal";
import { getPreTenderingOutboxDal } from "../../dal/departmentalAdmin/daPreProcurement.dal";



export const getPreProcurementForBoq = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementForBoqDal(req)
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


export const getPreProcurementBulkByOrderNo = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementBulkByOrderNoDal(req)
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


export const createBoq = async (req: Request, res: Response) => {
    const result: any = await createBoqDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `BOQ created successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while creating BOQ`,
            error: result?.message
        })
    }
}


export const getBoqInbox = async (req: Request, res: Response) => {
    const result: any = await getBoqInboxDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `BOQ list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching BOQ`,
            error: result?.message
        })
    }
}


export const getBoqOutbox = async (req: Request, res: Response) => {
    const result: any = await getBoqOutboxDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `BOQ list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching BOQ`,
            error: result?.message
        })
    }
}

export const forwardToDa = async (req: Request, res: Response) => {
    const result: any = await forwardToDaDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Forwarded to DA`,
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

// export const releaseForTender = async (req: Request, res: Response) => {
//     const result: any = await releaseForTenderDal(req)
//     if (!result?.error) {
//         res.status(200).json({
//             status: true,
//             message: `Released for tender successfully`,
//             data: result
//         })
//     } else {
//         res.status(404).json({
//             status: false,
//             message: `Error while releasing for tender`,
//             error: result?.message
//         })
//     }
// }


export const getPreProcurementOutbox = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementOutboxDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement outbox list for accountant fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement outbox list for accountant`,
            error: result?.message
        })
    }
}


export const getPreTenderingInbox = async (req: Request, res: Response) => {
    const result: any = await getPreTenderingInboxDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre tendering form list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre tendering form list`,
            error: result?.message
        })
    }
}



export const getPreTenderingOutbox = async (req: Request, res: Response) => {
    const result: any = await getPreTenderingOutboxDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre tendering form list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre tendering form list`,
            error: result?.message
        })
    }
}




//Pre-tender==================================================================================================================================================================================


export const createBasicDetailsPt = async (req: Request, res: Response) => {
    const result: any = await createBasicDetailsPtDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Basic details added successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while added Basic details`,
            error: result?.message
        })
    }
}



//Pre-tender==================================================================================================================================================================================

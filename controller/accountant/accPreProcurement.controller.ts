import { Request, Response } from 'express';
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
    getPreTenderingOutboxDal,
    createBasicDetailsPtDal,
    getBasicDetailsPtDal,
    createWorkDetailsPtDal,
    getWorkDetailsPtDal,
    createFeeDetailsPtDal,
    getFeeDetailsPtDal,
    createCriticalDatesPtDal,
    getCriticalDatesPtDal,
    createBidOpenersPtDal,
    getBidOpenersPtDal,
    createCoverDetailsPtDal,
    getCoverDetailsPtDal,
    getPreTenderDal,
    finalSubmissionPtDal,
    forwardToDaPtDal,
    forwardToTaPtDal
} from '../../dal/accountant/accPreProcurement.dal';

export const getPreProcurementForBoq = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementForBoqDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement list`,
            error: result?.message,
        });
    }
};

export const getPreProcurement = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement list`,
            error: result?.message,
        });
    }
};

export const getPreProcurementBulkByOrderNo = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementBulkByOrderNoDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement fetched successfully`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement`,
            error: result?.message,
        });
    }
};

export const createBoq = async (req: Request, res: Response) => {
    const result: any = await createBoqDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `BOQ created successfully`,
            reference_no: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while creating BOQ`,
            error: result?.message,
        });
    }
};

export const getBoqInbox = async (req: Request, res: Response) => {
    const result: any = await getBoqInboxDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `BOQ list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching BOQ`,
            error: result?.message,
        });
    }
};

export const getBoqOutbox = async (req: Request, res: Response) => {
    const result: any = await getBoqOutboxDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `BOQ list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching BOQ`,
            error: result?.message,
        });
    }
};

export const forwardToDa = async (req: Request, res: Response) => {
    const result: any = await forwardToDaDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Forwarded to DA`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while forwarding to DA`,
            error: result?.message,
        });
    }
};

export const getPreProcurementOutbox = async (req: Request, res: Response) => {
    const result: any = await getPreProcurementOutboxDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre procurement outbox list for accountant fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement outbox list for accountant`,
            error: result?.message,
        });
    }
};

export const getPreTenderingInbox = async (req: Request, res: Response) => {
    const result: any = await getPreTenderingInboxDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre tendering form list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre tendering form list`,
            error: result?.message,
        });
    }
};

export const getPreTenderingOutbox = async (req: Request, res: Response) => {
    const result: any = await getPreTenderingOutboxDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre tendering form list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre tendering form list`,
            error: result?.message,
        });
    }
};

//Pre-tender==================================================================================================================================================================================

export const createBasicDetailsPt = async (req: Request, res: Response) => {
    const result: any = await createBasicDetailsPtDal(req);
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Basic details added successfully`,
            data: result,
        });
    } else {
        res.status(500).json({
            status: false,
            message: `Error while adding Basic details`,
            error: result?.message,
        });
    }
};

export const getBasicDetailsPt = async (req: Request, res: Response) => {
    const result: any = await getBasicDetailsPtDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Basic details fetched successfully`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching basic details`,
            error: result?.message,
        });
    }
};

export const createWorkDetailsPt = async (req: Request, res: Response) => {
    const result: any = await createWorkDetailsPtDal(req);
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Work details added successfully`,
            data: result,
        });
    } else {
        res.status(500).json({
            status: false,
            message: `Error while adding work details`,
            error: result?.message,
        });
    }
};

export const getWorkDetailsPt = async (req: Request, res: Response) => {
    const result: any = await getWorkDetailsPtDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Work details fetched successfully`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Work details`,
            error: result?.message,
        });
    }
};

export const createFeeDetailsPt = async (req: Request, res: Response) => {
    const result: any = await createFeeDetailsPtDal(req);
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Fee details added successfully`,
            data: result,
        });
    } else {
        res.status(500).json({
            status: false,
            message: `Error while adding Fee details`,
            error: result?.message,
        });
    }
};

export const getFeeDetailsPt = async (req: Request, res: Response) => {
    const result: any = await getFeeDetailsPtDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Fee details fetched successfully`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Fee details`,
            error: result?.message,
        });
    }
};

export const createCriticalDatesPt = async (req: Request, res: Response) => {
    const result: any = await createCriticalDatesPtDal(req);
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Critical dates added successfully`,
            data: result,
        });
    } else {
        res.status(500).json({
            status: false,
            message: `Error while adding critical dates`,
            error: result?.message,
        });
    }
};

export const getCriticalDatesPt = async (req: Request, res: Response) => {
    const result: any = await getCriticalDatesPtDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Critical dates fetched successfully`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching critical dates`,
            error: result?.message,
        });
    }
};

export const createBidOpenersPt = async (req: Request, res: Response) => {
    const result: any = await createBidOpenersPtDal(req);
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Bid opener added successfully`,
            data: result,
        });
    } else {
        res.status(500).json({
            status: false,
            message: `Error while adding bid opener`,
            error: result?.message,
        });
    }
};

export const getBidOpenersPt = async (req: Request, res: Response) => {
    const result: any = await getBidOpenersPtDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Bid opener fetched successfully`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching bid opener`,
            error: result?.message,
        });
    }
};

export const createCoverDetailsPt = async (req: Request, res: Response) => {
    const result: any = await createCoverDetailsPtDal(req);
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Cover details added successfully`,
            data: result,
        });
    } else {
        res.status(500).json({
            status: false,
            message: `Error while adding cover details`,
            error: result?.message,
        });
    }
};

export const getCoverDetailsPt = async (req: Request, res: Response) => {
    const result: any = await getCoverDetailsPtDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Cover details fetched successfully`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching cover details`,
            error: result?.message,
        });
    }
};

//Get all at once
export const getPreTender = async (req: Request, res: Response) => {
    const result: any = await getPreTenderDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre tender fetched successfully`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching pre tender`,
            error: result?.message,
        });
    }
};

export const finalSubmissionPt = async (req: Request, res: Response) => {
    const result: any = await finalSubmissionPtDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Submitted`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while submitting`,
            error: result?.message,
        });
    }
};

export const forwardToDaPt = async (req: Request, res: Response) => {
    const result: any = await forwardToDaPtDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Forwarded`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while forwarding`,
            error: result?.message,
        });
    }
};

export const forwardToTaPt = async (req: Request, res: Response) => {
    const result: any = await forwardToTaPtDal(req);
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Forwarded`,
            data: result,
        });
    } else {
        res.status(404).json({
            status: false,
            message: `Error while forwarding`,
            error: result?.message,
        });
    }
};

//Pre-tender==================================================================================================================================================================================

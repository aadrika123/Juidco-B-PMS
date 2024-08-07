import { Request, Response } from "express";
import {
    getTaInboxDal,
    getTaOutboxDal,
    selectBidTypeDal,
    addCriteriaDal,
    submitCriteriaDal,
    addBidderDetailsDal,
    submitBidderDetailsDal
} from "../../dal/tenderingAdmin/ta.dal";


export const getTaInbox = async (req: Request, res: Response) => {
    const result: any = await getTaInboxDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Bid details list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching bid details list`,
            error: result?.message,
        })
    }
}

export const getTaOutbox = async (req: Request, res: Response) => {
    const result: any = await getTaOutboxDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Bid details list fetched successfully`,
            data: result?.data,
            pagination: result?.pagination,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching bid details list`,
            error: result?.message,
        })
    }
}

export const selectBidType = async (req: Request, res: Response) => {
    const result: any = await selectBidTypeDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Bid type selected successfully`,
            data: result
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Error while selecting bid type`,
            error: result?.message
        })
    }
}

export const addCriteria = async (req: Request, res: Response) => {
    const result: any = await addCriteriaDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Criteria added successfully`,
            data: result
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Error while adding criteria`,
            error: result?.message
        })
    }
}

export const submitCriteria = async (req: Request, res: Response) => {
    const result: any = await submitCriteriaDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Criteria submitted successfully`,
            data: result
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Error while submitting criteria`,
            error: result?.message
        })
    }
}

export const addBidderDetails = async (req: Request, res: Response) => {
    const result: any = await addBidderDetailsDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Bidder details added successfully`,
            data: result
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Error while adding bidder details`,
            error: result?.message
        })
    }
}

export const submitBidderDetails = async (req: Request, res: Response) => {
    const result: any = await submitBidderDetailsDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Bidder details submitted successfully`,
            data: result
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Error while submitting bidder details`,
            error: result?.message
        })
    }
}
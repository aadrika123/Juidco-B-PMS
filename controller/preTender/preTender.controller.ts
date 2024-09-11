import { Request, Response } from "express";
import {
    getPreTenderDal,
    createPreTenderDetailsDal,
    getPreTenderDetailsDal,
    addNoOfCoversDal
} from "../../dal/preTender/preTender.dal";


export const getPreTender = async (req: Request, res: Response) => {
    const result: any = await getPreTenderDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Pre tender fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching pre tender`,
            error: result?.message
        })
    }
}

export const createPreTenderDetails = async (req: Request, res: Response) => {
    const result: any = await createPreTenderDetailsDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Pre tender details created successfully`,
            data: result
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Error while Pre tender details creation`,
            error: result?.message
        })
    }
}

export const getPreTenderDetails = async (req: Request, res: Response) => {
    const result: any = await getPreTenderDetailsDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Pre tender details fetched successfully`,
            data: result
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Error while fetching Pre tender details`,
            error: result?.message
        })
    }
}

export const addNoOfCovers = async (req: Request, res: Response) => {
    const result: any = await addNoOfCoversDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `added successfully`,
            data: result
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Error while adding`,
            error: result?.message
        })
    }
}
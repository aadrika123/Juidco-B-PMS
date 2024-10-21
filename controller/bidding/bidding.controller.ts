import { Request, Response } from "express";
import {
    getBidDetailsDal,
    getProcurementDetailsByRefNoDal,
    getRateContractDetailsNoDal,
    getBidderByIdDal
} from "../../dal/bidding/bidding.dal";


export const getBidDetails = async (req: Request, res: Response) => {
    const result: any = await getBidDetailsDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Bid details fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching bid details`,
            error: result?.message
        })
    }
}

export const getProcurementDetailsByRefNo = async (req: Request, res: Response) => {
    const result: any = await getProcurementDetailsByRefNoDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Procurement details fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching procurement details`,
            error: result?.message
        })
    }
}

export const getRateContractDetailsNo = async (req: Request, res: Response) => {
    const result: any = await getRateContractDetailsNoDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Rate contract details fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching rate contract details`,
            error: result?.message
        })
    }
}

export const getBidderById = async (req: Request, res: Response) => {
    const result: any = await getBidderByIdDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Bidder details fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching bidder details`,
            error: result?.message
        })
    }
}
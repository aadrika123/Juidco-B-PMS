import { Request, Response } from 'express'
import { createBrandDal, getBrandDal, getBrandBySubcategoryIdDal, getBrandActiveOnlyDal, getBrandBySubcategoryIdActiveOnlyDal, editBrandDal, switchStatusDal, getBrandByIdDal } from '../../dal/masterEntry/brand.dal'

export const createBrand = async (req: Request, res: Response) => {
    const result: any = await createBrandDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Brand created having id : ${result.id}`,
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Brand creation failed`,
            error: result?.message,
        })
    }
}

export const getBrand = async (req: Request, res: Response) => {
    const result: any = await getBrandDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Brand list fetched successfully`,
            data: result,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching brand list`,
            error: result?.message,
        })
    }
}

export const getBrandBySubcategoryId = async (req: Request, res: Response) => {
    const result: any = await getBrandBySubcategoryIdDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Brand list fetched successfully`,
            data: result,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching brand list`,
            error: result?.message,
        })
    }
}

export const getBrandBySubcategoryIdActiveOnly = async (req: Request, res: Response) => {
    const result: any = await getBrandBySubcategoryIdActiveOnlyDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Active brand fetched successfully`,
            data: result,
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching active brand`,
            error: result?.message,
        })
    }
}

export const getBrandActiveOnly = async (req: Request, res: Response) => {
    const result: any = await getBrandActiveOnlyDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Active brand list fetched successfully`,
            data: result,
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Error while fetching active brand`,
            error: result?.message,
        })
    }
}

export const editBrand = async (req: Request, res: Response) => {
    const result: any = await editBrandDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Brand updated having id : ${result.id}`,
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Brand update failed`,
            error: result?.message,
        })
    }
}

export const switchStatus = async (req: Request, res: Response) => {
    const result: any = await switchStatusDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Status switched`,
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Status switch failed`,
            error: result?.message,
        })
    }
}

export const getBrandById = async (req: Request, res: Response) => {
    const result: any = await getBrandByIdDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Brand fetched successfully`,
            data: result,
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Error while fetching brand`,
            error: result?.message,
        })
    }
}
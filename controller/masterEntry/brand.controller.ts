import { Request, Response } from "express";
import { createBrandDal, getBrandDal, getBrandBySubcategoryIdDal } from "../../dal/masterEntry/brand.dal";


export const createBrand = async (req: Request, res: Response) => {
    const result: any = await createBrandDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Brand created having id : ${result.id}`
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Brand creation failed`,
            error: result?.message
        })
    }
}


export const getBrand = async (req: Request, res: Response) => {
    const result: any = await getBrandDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Brand list fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching brand list`,
            error: result?.message
        })
    }
}


export const getBrandBySubcategoryId = async (req: Request, res: Response) => {
    const result: any = await getBrandBySubcategoryIdDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Brand list fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching brand list`,
            error: result?.message
        })
    }
}
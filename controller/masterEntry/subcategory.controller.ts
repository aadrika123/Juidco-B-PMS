import { Request, Response } from "express";
import { createSubcategoryDal, getSubcategoryDal, getSubcategoryByCategoryIdDal } from "../../dal/masterEntry/subcategory.dal";

export const createSubCategory = async (req: Request, res: Response) => {
    const result: any = await createSubcategoryDal(req)
    if (!result?.error) {
        res.status(201).json({
            status: true,
            message: `Sub category created having id : ${result.id}`
        })
    } else {
        res.status(400).json({
            status: false,
            message: `Subcategory creation failed`,
            error: result?.message
        })
    }
}


export const getSubcategory = async (req: Request, res: Response) => {
    const result: any = await getSubcategoryDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Subcategory list fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching subcategory list`,
            error: result?.message
        })
    }
}


export const getSubcategoryByCategoryId = async (req: Request, res: Response) => {
    const result: any = await getSubcategoryByCategoryIdDal(req)
    if (!result?.error) {
        res.status(200).json({
            status: true,
            message: `Subcategory fetched successfully`,
            data: result
        })
    } else {
        res.status(404).json({
            status: false,
            message: `Error while fetching subcategory`,
            error: result?.message
        })
    }
}
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()


export const createBrandDal = async (req: Request) => {
    const { name, subcategory } = req.body

    const data: any = {
        name: name,
        subcategory_masterId: subcategory
    }

    try {
        const result = await prisma.brand_master.create({
            data: data
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getBrandDal = async (req: Request) => {

    try {
        const result = await prisma.brand_master.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


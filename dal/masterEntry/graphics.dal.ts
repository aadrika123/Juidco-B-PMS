import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()


export const createGraphicsDal = async (req: Request) => {
    const { name, vram } = req.body

    const data: any = {
        name: name,
        vram: vram
    }

    try {
        const result = await prisma.graphics_master.create({
            data: data
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getGraphicsDal = async (req: Request) => {

    try {
        const result = await prisma.graphics_master.findMany({
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


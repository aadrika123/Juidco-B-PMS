import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()


export const createRomDal = async (req: Request) => {
    const { capacity, type } = req.body

    const data: any = {
        capacity: capacity,
        type: type
    }

    try {
        const result = await prisma.rom_master.create({
            data: data
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getRomDal = async (req: Request) => {

    try {
        const result = await prisma.rom_master.findMany({
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


import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()


export const createRamDal = async (req: Request) => {
    const { capacity } = req.body

    const data: any = {
        capacity: capacity
    }

    try {
        const result = await prisma.ram_master.create({
            data: data
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getRamDal = async (req: Request) => {

    try {
        const result = await prisma.ram_master.findMany({
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


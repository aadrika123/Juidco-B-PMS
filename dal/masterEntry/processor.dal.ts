import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()


export const createProcessorDal = async (req: Request) => {
    const { name } = req.body

    const data: any = {
        name: name
    }

    try {
        const result = await prisma.processor_master.create({
            data: data
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getProcessorDal = async (req: Request) => {

    try {
        const result = await prisma.processor_master.findMany({
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


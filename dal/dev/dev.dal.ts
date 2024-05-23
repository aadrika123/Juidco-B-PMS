import { Request } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const makeStockReceivedDal = async (req: Request) => {
    const { order_no }: { order_no: string[] } = req.body

    

}

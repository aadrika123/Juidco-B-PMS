import { Request, Response } from "express";
import getErrorMessage from "../../lib/getErrorMessage";
import {
    PrismaClient,
    inventory
} from "@prisma/client";
import { pagination } from "../../type/common.type";


const prisma = new PrismaClient()


export const createItemDal = async (req: Request) => {
    const {
        category,
        subcategory,
        brand,
        quantity,
        description
    } = req.body

    const data: inventory = {
        category_masterId: category,
        subcategory_masterId: subcategory,
        brand_masterId: brand,
        ...(quantity && { quantity: quantity }),
        ...(description && { description: description })
    }

    try {
        const result = await prisma.inventory.create({
            data: data
        })
        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}


export const getItemDal = async (req: Request) => {
    const page: number | undefined = Number(req?.query?.page)
    const take: number | undefined = Number(req?.query?.take)
    const startIndex: number | undefined = (page - 1) * take
    const endIndex: number | undefined = startIndex + take
    let count: number
    let totalPage: number
    let pagination: pagination = {}
    const whereClause: any = {};

    const search: string | undefined = req?.query?.search ? String(req?.query?.search) : undefined

    const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
    const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
    const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

    //creating search options for the query
    if (search) {
        whereClause.OR = [
            {
                description: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        ];
    }

    //creating filter options for the query
    if (category[0]) {
        whereClause.category_masterId = {
            in: category
        }
    }
    if (subcategory[0]) {
        whereClause.subcategory_masterId = {
            in: subcategory
        }
    }
    if (brand[0]) {
        whereClause.brand_masterId = {
            in: brand
        }
    }

    try {
        count = await prisma.inventory.count({
            where: whereClause
        })
        const result = await prisma.inventory.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                subcategory: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                description: true
            }
        })
        totalPage = Math.ceil(count / take)
        if (endIndex < count) {
            pagination.next = {
                page: page + 1,
                take: take
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                take: take
            }
        }
        pagination.currentPage = page
        pagination.currentTake = take
        pagination.totalPage = totalPage
        pagination.totalResult = count
        return {
            data: result,
            pagination: pagination
        }
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}


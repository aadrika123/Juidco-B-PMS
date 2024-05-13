import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()


export const createItemDal = async (req: Request) => {
    const {
        name,
        category,
        subcategory,
        brand,
        processor,
        ram,
        os,
        rom,
        graphics,
        other_description
    } = req.body

    const data: any = {
        name: name,
        category_masterId: category,
        subcategory_masterId: subcategory,
        brand_masterId: brand,
        processor_masterId: processor,
        ram_masterId: ram,
        os_masterId: os,
        rom_masterId: rom,
        graphics_masterId: graphics,
        other_description: other_description
    }

    try {
        const result = await prisma.item_master.create({
            data: data
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getItemDal = async (req: Request) => {
    const page: number | undefined = Number(req?.query?.page)
    const take: number | undefined = Number(req?.query?.take)
    const startIndex: number | undefined = (page - 1) * take
    const endIndex: number | undefined = startIndex + take
    let count: number
    let totalPage: number
    let pagination: any = {}
    const whereClause: any = {};

    const search: string = req?.query?.search ? String(req?.query?.search) : ''

    const category: any[] = Array.isArray(req?.query?.category) ? req?.query?.category : [req?.query?.category]
    const subcategory: any[] = Array.isArray(req?.query?.scategory) ? req?.query?.scategory : [req?.query?.scategory]
    const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

    whereClause.OR = [
        {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        },
        {
            other_description: {
                contains: search,
                mode: 'insensitive'
            }
        }
    ];

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
        count = await prisma.item_master.count({
            where: whereClause
        })
        const result = await prisma.item_master.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                name: true,
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
                processor: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                ram: {
                    select: {
                        id: true,
                        capacity: true
                    }
                },
                os: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                rom: {
                    select: {
                        id: true,
                        capacity: true,
                        type: true
                    }
                },
                graphics: {
                    select: {
                        id: true,
                        name: true,
                        vram: true
                    }
                },
                other_description: true
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
        return {
            data: result,
            pagination: pagination
        }
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getItemByIdDal = async (req: Request) => {
    const { id } = req.params
    try {
        const result = await prisma.item_master.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
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
                processor: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                ram: {
                    select: {
                        id: true,
                        capacity: true
                    }
                },
                os: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                rom: {
                    select: {
                        id: true,
                        capacity: true,
                        type: true
                    }
                },
                graphics: {
                    select: {
                        id: true,
                        name: true,
                        vram: true
                    }
                },
                other_description: true
            }
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}

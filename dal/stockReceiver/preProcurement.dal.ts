import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import generateOrderNumber from "../../lib/orderNumberGenerator";


const prisma = new PrismaClient()


export const createPreProcurementDal = async (req: Request) => {
    let order_no: string
    const {
        category,
        subcategory,
        brand,
        processor,
        ram,
        os,
        rom,
        graphics,
        other_description,
        rate,
        quantity,
        total_rate
    } = req.body

    order_no = generateOrderNumber()
    if (order_no) {
        try {
            const existance = await prisma.sr_pre_procurement_inbox.count({
                where: {
                    order_no: order_no
                }
            })
            if (existance) {
                order_no = generateOrderNumber()
            }
        } catch (err: any) {
            console.log(err?.message)
        }
    }

    const data: any = {
        category: { connect: { id: category } },
        subcategory: { connect: { id: subcategory } },
        brand: { connect: { id: brand } },
        processor: { connect: { id: processor } },
        ram: { connect: { id: ram } },
        os: { connect: { id: os } },
        rom: { connect: { id: rom } },
        graphics: { connect: { id: graphics } },
        other_description: other_description,
        order_no: order_no,
        rate: Number(rate),
        quantity: Number(quantity),
        total_rate: Number(total_rate),
        status: {
            create: {
                order_no: order_no,
                status: 0
            }
        }
    }
    if (Number(rate) && Number(quantity)) {
        if (Number(rate) * Number(quantity) !== Number(total_rate)) {
            return { error: true, message: "The calculation result for total rate is invalid" }
        }
    }

    try {
        const result = await prisma.sr_pre_procurement_inbox.create({
            data: data
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getPreProcurementDal = async (req: Request) => {
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
            order_no: {
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
        count = await prisma.sr_pre_procurement_inbox.count({
            where: whereClause
        })
        const result = await prisma.sr_pre_procurement_inbox.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                order_no: true,
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
                other_description: true,
                rate: true,
                quantity: true,
                total_rate: true,
                status: {
                    select: {
                        id: true,
                        status: true
                    }
                },
                remark: true,
                isEdited: true
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


export const getPreProcurementByIdDal = async (req: Request) => {
    const { id } = req.params
    try {
        const result = await prisma.sr_pre_procurement_inbox.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                order_no: true,
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
                other_description: true,
                rate: true,
                quantity: true,
                status: {
                    select: {
                        id: true,
                        status: true
                    }
                },
                isEdited: true,
                remark: true
            }
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getPreProcurementByOrderNoDal = async (req: Request) => {
    const { order_no } = req.params
    try {
        const result = await prisma.sr_pre_procurement_inbox.findFirst({
            where: {
                order_no: order_no
            },
            select: {
                id: true,
                order_no: true,
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
                other_description: true,
                rate: true,
                quantity: true,
                status: {
                    select: {
                        id: true,
                        status: true
                    }
                },
                isEdited: true,
                remark: true
            }
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const forwardToDaDal = async (req: Request) => {
    const { preProcurement }: { preProcurement: string[] } = req.body
    try {
        preProcurement.map(async (item) => {
            const inbox: any = await prisma.sr_pre_procurement_inbox.findFirst({
                where: {
                    id: item
                },
                select: {
                    order_no: true,
                    category_masterId: true,
                    subcategory_masterId: true,
                    brand_masterId: true,
                    processor_masterId: true,
                    ram_masterId: true,
                    os_masterId: true,
                    rom_masterId: true,
                    graphics_masterId: true,
                    other_description: true,
                    rate: true,
                    quantity: true,
                    total_rate: true,
                    statusId: true,
                    isEdited: true,
                    remark: true
                }
            })
            if (inbox === null) {
                return
            }
            const daOutbox: any = await prisma.da_pre_procurement_outbox.count({
                where: {
                    order_no: inbox?.order_no
                }
            })
            await prisma.$transaction([

                prisma.sr_pre_procurement_outbox.create({
                    data: inbox
                }),
                prisma.da_pre_procurement_inbox.create({
                    data: inbox
                }),
                prisma.procurement_status.update({
                    where: {
                        id: inbox?.statusId
                    },
                    data: {
                        status: 1
                    }
                }),
                prisma.sr_pre_procurement_inbox.delete({
                    where: {
                        id: item
                    },
                }),
                ...(daOutbox !== 0 ? [prisma.da_pre_procurement_outbox.delete({
                    where: {
                        order_no: inbox?.order_no
                    },
                })] : [])

            ])
        })
        return "forwarded"
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getPreProcurementOutboxDal = async (req: Request) => {
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
            order_no: {
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
        count = await prisma.sr_pre_procurement_outbox.count({
            where: whereClause
        })
        const result = await prisma.sr_pre_procurement_outbox.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                order_no: true,
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
                other_description: true,
                rate: true,
                quantity: true,
                total_rate: true,
                status: {
                    select: {
                        id: true,
                        status: true
                    }
                },
                isEdited: true,
                remark: true
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

export const getPreProcurementOutboxByIdDal = async (req: Request) => {
    const { id } = req.params
    try {
        const result = await prisma.sr_pre_procurement_outbox.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                order_no: true,
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
                other_description: true,
                rate: true,
                quantity: true,
                status: {
                    select: {
                        id: true,
                        status: true
                    }
                },
                isEdited: true,
                remark: true
            }
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}

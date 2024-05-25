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
        total_rate,
        colour,
        material,
        dimension,
        room_type,
        included_components,
        size,
        recomended_uses,
        bristle,
        weight,
        number_of_items,
        ulb_id
    } = req.body

    order_no = generateOrderNumber(ulb_id)
    if (order_no) {
        try {
            const existance = await prisma.sr_pre_procurement_inbox.count({
                where: {
                    order_no: order_no
                }
            })
            if (existance) {
                order_no = generateOrderNumber(ulb_id)
            }
        } catch (err: any) {
            console.log(err?.message)
        }
    }

    const data: any = {
        category: { connect: { id: category } },
        subcategory: { connect: { id: subcategory } },
        brand: brand,
        processor: processor,
        ram: ram,
        os: os,
        rom: rom,
        graphics: graphics,
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
        },
        colour: colour,
        material: material,
        dimension: dimension,
        room_type: room_type,
        included_components: included_components,
        size: size,
        recomended_uses: recomended_uses,
        bristle: bristle,
        weight: weight,
        number_of_items: Number(number_of_items)
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
    const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]

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
        },
        {
            brand: {
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
    if (status[0]) {
        whereClause.status = {
            status: {
                in: status.map(Number)
            }
        }
    }
    whereClause.NOT = [
        {
            status: {
                status: -2
            }
        },
        {
            status: {
                status: 2
            }
        },
    ]

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
                brand: true,
                processor: true,
                ram: true,
                os: true,
                rom: true,
                graphics: true,
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
                isEdited: true,
                colour: true,
                material: true,
                dimension: true,
                room_type: true,
                included_components: true,
                size: true,
                recomended_uses: true,
                bristle: true,
                weight: true,
                number_of_items: true
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
                brand: true,
                processor: true,
                ram: true,
                os: true,
                rom: true,
                graphics: true,
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
                remark: true,
                colour: true,
                material: true,
                dimension: true,
                room_type: true,
                included_components: true,
                size: true,
                recomended_uses: true,
                bristle: true,
                weight: true,
                number_of_items: true
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
                brand: true,
                processor: true,
                ram: true,
                os: true,
                rom: true,
                graphics: true,
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
                remark: true,
                colour: true,
                material: true,
                dimension: true,
                room_type: true,
                included_components: true,
                size: true,
                recomended_uses: true,
                bristle: true,
                weight: true,
                number_of_items: true
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
            const status: any = await prisma.sr_pre_procurement_inbox.findFirst({
                where: {
                    id: item
                },
                select: {
                    status: {
                        select: { status: true }
                    }
                }
            })
            if (status?.status?.status < -1 && status?.status?.status > 0) {
                return
            }
            const inbox: any = await prisma.sr_pre_procurement_inbox.findFirst({
                where: {
                    id: item
                },
                select: {
                    order_no: true,
                    category_masterId: true,
                    subcategory_masterId: true,
                    brand: true,
                    processor: true,
                    ram: true,
                    os: true,
                    rom: true,
                    graphics: true,
                    other_description: true,
                    rate: true,
                    quantity: true,
                    total_rate: true,
                    statusId: true,
                    isEdited: true,
                    remark: true,
                    colour: true,
                    material: true,
                    dimension: true,
                    room_type: true,
                    included_components: true,
                    size: true,
                    recomended_uses: true,
                    bristle: true,
                    weight: true,
                    number_of_items: true,
                    status: true
                }
            })

            const statusChecker = (status: number) => {
                if (status === 0) {
                    return 1
                } else {
                    return 69
                }
            }

            if (inbox === null) {
                return
            }
            const daOutbox: any = await prisma.da_pre_procurement_outbox.count({
                where: {
                    order_no: inbox?.order_no
                }
            })
            delete inbox.status
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
                        status: statusChecker(Number(inbox?.status?.status))
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
    const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]

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
        },
        {
            brand: {
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
    if (status[0]) {
        whereClause.status = {
            status: {
                in: status.map(Number)
            }
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
                brand: true,
                processor: true,
                ram: true,
                os: true,
                rom: true,
                graphics: true,
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
                remark: true,
                colour: true,
                material: true,
                dimension: true,
                room_type: true,
                included_components: true,
                size: true,
                recomended_uses: true,
                bristle: true,
                weight: true,
                number_of_items: true
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
                brand: true,
                processor: true,
                ram: true,
                os: true,
                rom: true,
                graphics: true,
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
                remark: true,
                colour: true,
                material: true,
                dimension: true,
                room_type: true,
                included_components: true,
                size: true,
                recomended_uses: true,
                bristle: true,
                weight: true,
                number_of_items: true
            }
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}



export const getPreProcurementRejectedDal = async (req: Request) => {
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
    const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]

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
        },
        {
            brand: {
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
    if (status[0]) {
        whereClause.status = {
            status: {
                in: status.map(Number)
            }
        }
    }
    whereClause.status = {
        status: -2
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
                brand: true,
                processor: true,
                ram: true,
                os: true,
                rom: true,
                graphics: true,
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
                isEdited: true,
                colour: true,
                material: true,
                dimension: true,
                room_type: true,
                included_components: true,
                size: true,
                recomended_uses: true,
                bristle: true,
                weight: true,
                number_of_items: true
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
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}



export const getPreProcurementReleasedDal = async (req: Request) => {
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
    const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]

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
        },
        {
            brand: {
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
    if (status[0]) {
        whereClause.status = {
            status: {
                in: status.map(Number)
            }
        }
    }
    whereClause.status = {
        status: 2
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
                brand: true,
                processor: true,
                ram: true,
                os: true,
                rom: true,
                graphics: true,
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
                isEdited: true,
                colour: true,
                material: true,
                dimension: true,
                room_type: true,
                included_components: true,
                size: true,
                recomended_uses: true,
                bristle: true,
                weight: true,
                number_of_items: true
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
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}



export const editPreProcurementDal = async (req: Request) => {
    const {
        id,
        order_no,
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
        total_rate,
        remark,
        colour,
        material,
        dimension,
        room_type,
        included_components,
        size,
        recomended_uses,
        bristle,
        weight,
        number_of_items
    } = req.body


    const data: any = {
        category: { connect: { id: category } },
        subcategory: { connect: { id: subcategory } },
        brand: brand,
        processor: processor,
        ram: ram,
        os: os,
        rom: rom,
        graphics: graphics,
        other_description: other_description,
        rate: Number(rate),
        quantity: Number(quantity),
        total_rate: Number(total_rate),
        remark: remark,
        isEdited: true,
        colour: colour,
        material: material,
        dimension: dimension,
        room_type: room_type,
        included_components: included_components,
        size: size,
        recomended_uses: recomended_uses,
        bristle: bristle,
        weight: weight,
        number_of_items: Number(number_of_items)
    }
    if (Number(rate) && Number(quantity)) {
        if (Number(rate) * Number(quantity) !== Number(total_rate)) {
            return { error: true, message: "The calculation result for total rate is invalid" }
        }
    }

    const preProcurement: any = await prisma.da_pre_procurement_inbox.findFirst({
        where: {
            id: id
        },
        select: {
            order_no: true,
            category_masterId: true,
            subcategory_masterId: true,
            brand: true,
            processor: true,
            ram: true,
            os: true,
            rom: true,
            graphics: true,
            other_description: true,
            rate: true,
            quantity: true,
            statusId: true,
            total_rate: true,
            remark: true,
            isEdited: true,
            colour: true,
            material: true,
            dimension: true,
            room_type: true,
            included_components: true,
            size: true,
            recomended_uses: true,
            bristle: true,
            weight: true,
            number_of_items: true
        }
    })
    const historyExistence = await prisma.pre_procurement_history.count({
        where: {
            order_no: order_no
        }
    })

    try {
        await prisma.$transaction([

            ...(historyExistence === 0 ? [prisma.pre_procurement_history.create({
                data: preProcurement
            })] : []),
            prisma.da_pre_procurement_inbox.update({
                where: {
                    id: id
                },
                data: data
            }),
            prisma.sr_pre_procurement_outbox.update({
                where: {
                    order_no: order_no
                },
                data: data
            }),
            // prisma.pre_procurement_history.update({
            //     where: {
            //         order_no: order_no
            //     },
            //     data: data
            // })

        ])
        return 'Edited'
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}
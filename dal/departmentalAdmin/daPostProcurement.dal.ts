import { Request } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()


export const getPostProcurementDal = async (req: Request) => {
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
            pre_procurement: {
                other_description: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        },
        {
            pre_procurement: {
                brand: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        }
    ];

    if (category[0]) {
        whereClause.pre_procurement = {
            category_masterId: {
                in: category
            }
        }
    }
    if (subcategory[0]) {
        whereClause.pre_procurement = {
            subcategory_masterId: {
                in: subcategory
            }
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
        count = await prisma.da_post_procurement_inbox.count({
            where: whereClause
        })
        const result: any = await prisma.da_post_procurement_inbox.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                order_no: true,
                pre_procurement: {
                    include: {
                        category: true,
                        subcategory: true
                    }
                },
                status: true,
                supplier_name: true,
                gst_no: true,
                final_rate: true,
                gst: true,
                total_quantity: true,
                total_price: true,
                unit_price: true,
                is_gst_added: true
            }
        })

        let resultToSend: any[] = []

        result.map((item: any) => {
            const tempPreProcurement = { ...item?.pre_procurement }
            delete tempPreProcurement.id
            delete tempPreProcurement.createdAt
            delete tempPreProcurement.updatedAt
            delete tempPreProcurement.statusId
            delete item.pre_procurement
            resultToSend.push({ ...item, ...tempPreProcurement })
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
            data: resultToSend,
            pagination: pagination
        }
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getPostProcurementByIdDal = async (req: Request) => {
    const { id } = req.params
    try {
        const result = await prisma.da_post_procurement_inbox.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                order_no: true,
                pre_procurement: {
                    include: {
                        category: true,
                        subcategory: true
                    }
                },
                status: true,
                supplier_name: true,
                gst_no: true,
                final_rate: true,
                gst: true,
                total_quantity: true,
                total_price: true,
                unit_price: true,
                is_gst_added: true
            }
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getPostProcurementByOrderNoDal = async (req: Request) => {
    const { order_no } = req.params
    try {
        const result = await prisma.da_post_procurement_inbox.findFirst({
            where: {
                order_no: order_no
            },
            select: {
                id: true,
                order_no: true,
                pre_procurement: {
                    include: {
                        category: true,
                        subcategory: true
                    }
                },
                status: true,
                supplier_name: true,
                gst_no: true,
                final_rate: true,
                gst: true,
                total_quantity: true,
                total_price: true,
                unit_price: true,
                is_gst_added: true
            }
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}



export const SaveAdditionalDetailsProcurementDal = async (req: Request) => {
    const {
        id,
        supplier_name,
        order_no,
        gst_no,
        final_rate,
        gst,
        total_quantity,
        total_price,
        unit_price,
        is_gst_added
    } = req.body


    const data: any = {
        supplier_name: supplier_name,
        gst_no: gst_no,
        final_rate: Number(final_rate),
        ...(gst && { gst: Number(gst) }),
        total_quantity: Number(total_quantity),
        total_price: Number(total_price),
        unit_price: Number(unit_price),
        is_gst_added: Boolean(is_gst_added),
    }
    if (Number(total_quantity) && Number(total_price)) {
        if (Math.floor((Number(total_price) / Number(total_quantity)) * 100) / 100 !== Number(unit_price)) {
            return { error: true, message: "The calculation result for Unit Price is invalid" }
        }
    }
    if (Boolean(is_gst_added)) {
        const gstValue = 1 + (Number(gst) / 100)
        if (Math.floor(Number(final_rate) * gstValue * 100) / 100 !== Number(total_price)) {
            return { error: true, message: "The calculation result for Total Price is invalid" }
        }
    }

    const daPostInbox: any = await prisma.da_post_procurement_inbox.findFirst({
        where: {
            id: id
        }
    })
    if (daPostInbox) {
        delete daPostInbox.id
        delete daPostInbox.createdAt
        delete daPostInbox.updatedAt
    }

    const daPostOut = await prisma.da_post_procurement_outbox.create({
        data: daPostInbox
    })

    try {
        const [daPostOutUp, daPostInDel, proStatusUp]: any = await prisma.$transaction([
            prisma.da_post_procurement_outbox.update({
                where: {
                    id: daPostOut?.id
                },
                data: data
            }),
            prisma.da_post_procurement_inbox.delete({
                where: {
                    id: id
                }
            }),
            prisma.procurement_status.update({
                where: {
                    order_no: order_no
                },
                data: {
                    status: 3
                }
            })
        ])
        if (!daPostOutUp || !daPostInDel || !proStatusUp) {
            await prisma.da_post_procurement_outbox.delete({
                where: {
                    id: daPostOut?.id
                }
            })
        }

        if (daPostOutUp) {
            delete daPostOutUp.id
            delete daPostOutUp.createdAt
            delete daPostOutUp.updatedAt
        }
        await prisma.$transaction([
            prisma.da_received_inventory_inbox.create({
                data: daPostOutUp
            }),
            prisma.sr_received_inventory_inbox.create({
                data: daPostOutUp
            }),
            prisma.sr_post_procurement_inbox.create({
                data: daPostOutUp
            })
        ])


        return 'Additional Details Saved'
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}



export const getPostProcurementOutboxDal = async (req: Request) => {
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
            pre_procurement: {
                other_description: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        },
        {
            pre_procurement: {
                brand: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        }
    ];

    if (category[0]) {
        whereClause.pre_procurement = {
            category_masterId: {
                in: category
            }
        }
    }
    if (subcategory[0]) {
        whereClause.pre_procurement = {
            subcategory_masterId: {
                in: subcategory
            }
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
        count = await prisma.da_post_procurement_outbox.count({
            where: whereClause
        })
        const result: any = await prisma.da_post_procurement_outbox.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                order_no: true,
                pre_procurement: {
                    include: {
                        category: true,
                        subcategory: true
                    }
                },
                status: true,
                supplier_name: true,
                gst_no: true,
                final_rate: true,
                gst: true,
                total_quantity: true,
                total_price: true,
                unit_price: true,
                is_gst_added: true
            }
        })

        let resultToSend: any[] = []

        result.map((item: any) => {
            const tempPreProcurement = { ...item?.pre_procurement }
            delete tempPreProcurement.id
            delete tempPreProcurement.createdAt
            delete tempPreProcurement.updatedAt
            delete tempPreProcurement.statusId
            delete item.pre_procurement
            resultToSend.push({ ...item, ...tempPreProcurement })
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
            data: resultToSend,
            pagination: pagination
        }
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getPostProcurementOutboxByIdDal = async (req: Request) => {
    const { id } = req.params
    try {
        const result = await prisma.da_post_procurement_outbox.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                order_no: true,
                pre_procurement: {
                    include: {
                        category: true,
                        subcategory: true
                    }
                },
                status: true,
                supplier_name: true,
                gst_no: true,
                final_rate: true,
                gst: true,
                total_quantity: true,
                total_price: true,
                unit_price: true,
                is_gst_added: true
            }
        })
        return result
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}
import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import getErrorMessage from "../../lib/getErrorMessage";
import { pagination } from "../../type/common.type";


const prisma = new PrismaClient()


export const getPostProcurementDal = async (req: Request) => {
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
    const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
    const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

    //creating search options for the query
    if (search) {
        whereClause.OR = [
            {
                procurement_no: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            {
                procurement: {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            }
        ];
    }

    //creating filter options for the query
    if (category[0]) {
        whereClause.procurement = {
            category_masterId: {
                in: category
            }
        }
    }
    if (subcategory[0]) {
        whereClause.procurement = {
            subcategory_masterId: {
                in: subcategory
            }
        }
    }
    if (status[0]) {
        whereClause.procurement = {
            status: {
                in: status.map(Number)
            }
        }
    }
    if (brand[0]) {
        whereClause.procurement = {
            brand: {
                in: brand
            }
        }
    }

    try {
        count = await prisma.da_post_procurement_inbox.count({
            where: whereClause
        })
        const result = await prisma.da_post_procurement_inbox.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                procurement_no: true,
                procurement: {
                    select: {
                        procurement_no: true,
                        category: {
                            select: {
                                name: true
                            }
                        },
                        subcategory: {
                            select: {
                                name: true
                            }
                        },
                        brand: {
                            select: {
                                name: true
                            }
                        },
                        post_procurement: {
                            select: {
                                procurement_no: true,
                                supplier_name: true,
                                gst_no: true,
                                final_rate: true,
                                gst: true,
                                total_quantity: true,
                                total_price: true,
                                unit_price: true,
                                is_gst_added: true,
                            }
                        },
                        description: true,
                        quantity: true,
                        rate: true,
                        total_rate: true,
                        isEdited: true,
                        remark: true,
                        status: {
                            select: {
                                status: true
                            }
                        }
                    }
                }
            }
        })

        let resultToSend: any[] = []

        result.map(async (item: any) => {
            const temp = { ...item?.procurement }
            delete item.procurement
            resultToSend.push({ ...item, ...temp })
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
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}


export const getPostProcurementByIdDal = async (req: Request) => {
    const { id } = req.params
    try {
        const result: any = await prisma.da_post_procurement_inbox.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                procurement_no: true,
                procurement: {
                    select: {
                        procurement_no: true,
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
                        post_procurement: {
                            select: {
                                procurement_no: true,
                                supplier_name: true,
                                gst_no: true,
                                final_rate: true,
                                gst: true,
                                total_quantity: true,
                                total_price: true,
                                unit_price: true,
                                is_gst_added: true,
                            }
                        },
                        description: true,
                        quantity: true,
                        rate: true,
                        total_rate: true,
                        isEdited: true,
                        remark: true,
                        status: {
                            select: {
                                status: true
                            }
                        }
                    }
                }
            }
        })

        let resultToSend: any = {}

        const temp = { ...result?.procurement }
        delete result.procurement
        resultToSend = { ...result, ...temp }

        return resultToSend
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}


export const getPostProcurementByOrderNoDal = async (req: Request) => {
    const { procurement_no } = req.params
    try {
        const result: any = await prisma.da_post_procurement_inbox.findFirst({
            where: {
                procurement_no: procurement_no
            },
            select: {
                id: true,
                procurement_no: true,
                procurement: {
                    select: {
                        procurement_no: true,
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
                        post_procurement: {
                            select: {
                                procurement_no: true,
                                supplier_name: true,
                                gst_no: true,
                                final_rate: true,
                                gst: true,
                                total_quantity: true,
                                total_price: true,
                                unit_price: true,
                                is_gst_added: true,
                            }
                        },
                        description: true,
                        quantity: true,
                        rate: true,
                        total_rate: true,
                        isEdited: true,
                        remark: true,
                        status: {
                            select: {
                                status: true
                            }
                        }
                    }
                }
            }
        })
        let resultToSend: any = {}

        const temp = { ...result?.procurement }
        delete result.procurement
        resultToSend = { ...result, ...temp }

        return resultToSend
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const SaveAdditionalDetailsProcurementDal = async (req: Request) => {
    const {
        supplier_name,
        procurement_no,
        gst_no,
        final_rate,
        gst,
        total_quantity,
        total_price,
        unit_price,
        is_gst_added
    } = req.body

    const gstValidation = /^([0][1-9]|[1-2][0-9]|[3][0-8])[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/;
    if (gst_no) {
        if (!gstValidation.test(gst_no)) {
            return { error: true, message: 'GST number is not valid' }
        }
    }

    const data: any = {
        procurement_no: procurement_no,
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

    try {
        await prisma.$transaction([
            prisma.post_procurement.create({
                data: data
            }),
            prisma.da_post_procurement_outbox.create({
                data: {
                    procurement_no: procurement_no
                }
            }),
            prisma.da_post_procurement_inbox.delete({
                where: {
                    procurement_no: procurement_no
                }
            }),
            prisma.procurement_status.update({
                where: {
                    procurement_no: procurement_no
                },
                data: {
                    status: 3
                }
            }),
            prisma.da_received_inventory_inbox.create({
                data: {
                    procurement_no: procurement_no
                }
            }),
            prisma.sr_received_inventory_inbox.create({
                data: {
                    procurement_no: procurement_no
                }
            }),
            prisma.sr_post_procurement_inbox.create({
                data: {
                    procurement_no: procurement_no
                }
            }),
            prisma.notification.create({
                data: {
                    role_id: Number(process.env.ROLE_SR),
                    title: 'Supplier assigned',
                    destination: 11,
                    description: `Supplier assigned for procurement number : ${procurement_no}`,
                },
            }),
        ])

        return 'Additional Details Saved'
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const getPostProcurementOutboxDal = async (req: Request) => {
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
    const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]
    const brand: any[] = Array.isArray(req?.query?.brand) ? req?.query?.brand : [req?.query?.brand]

    //creating search options for the query
    if (search) {
        whereClause.OR = [
            {
                procurement_no: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            {
                procurement: {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            }
        ];
    }

    //creating filter options for the query
    if (category[0]) {
        whereClause.procurement = {
            category_masterId: {
                in: category
            }
        }
    }
    if (subcategory[0]) {
        whereClause.procurement = {
            subcategory_masterId: {
                in: subcategory
            }
        }
    }
    if (status[0]) {
        whereClause.procurement = {
            status: {
                in: status.map(Number)
            }
        }
    }
    if (brand[0]) {
        whereClause.procurement = {
            brand: {
                in: brand
            }
        }
    }

    try {
        count = await prisma.da_post_procurement_outbox.count({
            where: whereClause
        })
        const result = await prisma.da_post_procurement_outbox.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                procurement_no: true,
                procurement: {
                    select: {
                        procurement_no: true,
                        category: {
                            select: {
                                name: true
                            }
                        },
                        subcategory: {
                            select: {
                                name: true
                            }
                        },
                        brand: {
                            select: {
                                name: true
                            }
                        },
                        post_procurement: {
                            select: {
                                procurement_no: true,
                                supplier_name: true,
                                gst_no: true,
                                final_rate: true,
                                gst: true,
                                total_quantity: true,
                                total_price: true,
                                unit_price: true,
                                is_gst_added: true,
                            }
                        },
                        description: true,
                        quantity: true,
                        rate: true,
                        total_rate: true,
                        isEdited: true,
                        remark: true,
                        status: {
                            select: {
                                status: true
                            }
                        }
                    }
                }
            }
        })

        let resultToSend: any[] = []

        result.map(async (item: any) => {
            const temp = { ...item?.procurement }
            delete item.procurement
            resultToSend.push({ ...item, ...temp })
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
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}


export const getPostProcurementOutboxByIdDal = async (req: Request) => {
    const { id } = req.params
    try {
        const result: any = await prisma.da_post_procurement_outbox.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                procurement_no: true,
                procurement: {
                    select: {
                        procurement_no: true,
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
                        post_procurement: {
                            select: {
                                procurement_no: true,
                                supplier_name: true,
                                gst_no: true,
                                final_rate: true,
                                gst: true,
                                total_quantity: true,
                                total_price: true,
                                unit_price: true,
                                is_gst_added: true,
                            }
                        },
                        description: true,
                        quantity: true,
                        rate: true,
                        total_rate: true,
                        isEdited: true,
                        remark: true,
                        status: {
                            select: {
                                status: true
                            }
                        }
                    }
                }
            }
        })

        let resultToSend: any = {}

        const temp = { ...result?.procurement }
        delete result.procurement
        resultToSend = { ...result, ...temp }

        return resultToSend
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}
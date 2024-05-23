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
                pre_procurement: true,
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
                pre_procurement: true,
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
                pre_procurement: true,
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
        if (Number(total_price) / Number(total_quantity) !== Number(unit_price)) {
            return { error: true, message: "The calculation result for Unit Price is invalid" }
        }
    }
    if (Boolean(is_gst_added)) {
        const gstValue = 1 + (Number(gst) / 100)
        if (Number(final_rate) * gstValue !== Number(total_price)) {
            return { error: true, message: "The calculation result for Total Price is invalid" }
        }
    }

    try {
        await prisma.$transaction([
            prisma.da_post_procurement_inbox.update({
                where: {
                    id: id
                },
                data: data
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
        return 'Post Procurement Saved'
    } catch (err: any) {
        console.log(err?.message)
        return { error: false, message: err?.message }
    }
}





export const releaseForTenderDal = async (req: Request) => {
    const { preProcurement }: { preProcurement: string[] } = req.body
    try {
        preProcurement.map(async (item) => {
            const inbox: any = await prisma.da_pre_procurement_inbox.findFirst({
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
                    number_of_items: true
                }
            })

            if (inbox === null) {
                return
            }

            const daPreOut = await prisma.da_pre_procurement_outbox.create({
                data: inbox
            })

            const [srPreInCr, daPostInCr, prSUp, daPreInDl, srPreOutDl] = await prisma.$transaction([
                prisma.sr_pre_procurement_inbox.create({
                    data: inbox
                }),
                prisma.da_post_procurement_inbox.create({
                    data: {
                        order_no: inbox?.order_no,
                        statusId: inbox?.statusId,
                        da_pre_procurement_outboxId: daPreOut?.id
                    }
                }),
                prisma.procurement_status.update({
                    where: {
                        id: inbox?.statusId
                    },
                    data: {
                        status: 2
                    }
                }),
                prisma.da_pre_procurement_inbox.delete({
                    where: {
                        id: item
                    },
                }),
                prisma.sr_pre_procurement_outbox.delete({
                    where: {
                        order_no: inbox?.order_no
                    },
                })
            ])
            if (!srPreInCr || !daPostInCr || !prSUp || !daPreInDl || !srPreOutDl) {
                await prisma.da_pre_procurement_outbox.delete({
                    where: {
                        order_no: inbox?.order_no
                    }
                })
            }
        })
        return "Released for tender"
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}
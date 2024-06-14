import { Request } from "express";
import { PrismaClient, procurement } from "@prisma/client";
import getErrorMessage from "../../lib/getErrorMessage";
import { imageUploader } from "../../lib/imageUploader";
import { pagination } from "../../type/common.type";
import axios from "axios";


const prisma = new PrismaClient()


export const getPreProcurementDal = async (req: Request) => {
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
            brand_masterId: {
                in: brand
            }
        }
    }

    try {
        count = await prisma.da_pre_procurement_inbox.count({
            where: whereClause
        })
        const result = await prisma.da_pre_procurement_inbox.findMany({
            orderBy: {
                createdAt: 'desc'
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
                        description: true,
                        remark: true,
                        quantity: true,
                        rate: true,
                        total_rate: true,
                        isEdited: true,
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


export const getPreProcurementByIdDal = async (req: Request) => {
    const { id } = req.params
    try {
        const result: any = await prisma.da_pre_procurement_inbox.findFirst({
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


export const getPreProcurementByOrderNoDal = async (req: Request) => {
    const { procurement_no } = req.params
    try {
        const result: any = await prisma.da_pre_procurement_inbox.findFirst({
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


export const backToSrDal = async (req: Request) => {
    const { preProcurement, remark }: { preProcurement: string[], remark: string } = req.body
    try {
        preProcurement.map(async (item) => {
            const inbox: any = await prisma.da_pre_procurement_inbox.findFirst({
                where: {
                    id: item
                },
                select: {
                    procurement_no: true
                }
            })
            if (inbox === null) {
                return
            }
            await prisma.$transaction([

                prisma.da_pre_procurement_outbox.create({
                    data: inbox
                }),
                prisma.sr_pre_procurement_inbox.create({
                    data: inbox
                }),
                prisma.procurement.update({
                    where: {
                        procurement_no: inbox?.procurement_no
                    },
                    data: {
                        remark: remark
                    }
                }),
                prisma.procurement_status.update({
                    where: {
                        procurement_no: inbox?.procurement_no
                    },
                    data: {
                        status: -1
                    }
                }),
                prisma.da_pre_procurement_inbox.delete({
                    where: {
                        id: item
                    },
                }),
                prisma.sr_pre_procurement_outbox.delete({
                    where: {
                        procurement_no: inbox?.procurement_no
                    },
                })

            ])
        })
        return "Reversed"
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: getErrorMessage(err) }
    }
}


export const editPreProcurementDal = async (req: Request) => {
    const {
        procurement_no,
        category,
        subcategory,
        brand,
        description,
        rate,
        quantity,
        total_rate,
        remark
    } = req.body


    const data = {
        category: { connect: { id: category } },
        subcategory: { connect: { id: subcategory } },
        brand: { connect: { id: brand } },
        description: description,
        rate: Number(rate),
        quantity: Number(quantity),
        total_rate: Number(total_rate),
        remark: remark,
        isEdited: true
    }
    if (Number(rate) && Number(quantity)) {
        if (Number(rate) * Number(quantity) !== Number(total_rate)) {
            return { error: true, message: "The calculation result for total rate is invalid" }
        }
    }

    const procurement: any = await prisma.procurement.findFirst({
        where: {
            procurement_no: procurement_no
        },
        include: {
            status: true
        }
    })
    const tempStatus = Number(procurement?.status?.status)

    const tempData: any = {
        procurement_no: procurement_no,
        category: { connect: { id: procurement?.category_masterId } },
        subcategory: { connect: { id: procurement?.subcategory_masterId } },
        brand: { connect: { id: procurement?.brand_masterId } },
        description: procurement?.description,
        rate: procurement?.rate,
        quantity: procurement?.quantity,
        total_rate: procurement?.total_rate,
        remark: procurement?.remark,
        isEdited: procurement?.isEdited,
        status: tempStatus
    }

    const historyExistence = await prisma.procurement_history.count({
        where: {
            procurement_no: procurement_no
        }
    })

    try {
        await prisma.$transaction([

            ...(historyExistence === 0 ? [prisma.procurement_history.create({
                data: tempData
            })] : []),
            prisma.procurement.update({
                where: {
                    procurement_no: procurement_no
                },
                data: data
            })

        ])
        return 'Edited'
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}


export const releaseForTenderDal = async (req: Request) => {
    const { preProcurement }: { preProcurement: string } = req.body
    const img = req.files
    try {
        await Promise.all(
            JSON.parse(preProcurement).map(async (item: string) => {
                const inbox: any = await prisma.da_pre_procurement_inbox.findFirst({
                    where: {
                        id: item
                    },
                    select: {
                        procurement_no: true,
                    }
                })

                if (inbox === null) {
                    throw { error: true, message: 'Invalid inbox ID' }
                }

                if (img) {
                    const uploaded = await imageUploader(img)   //It will return reference number and unique id as an object after uploading.

                    await Promise.all(
                        uploaded.map(async (item) => {
                            await prisma.note_sheet.create({
                                data: {
                                    procurement_no: inbox?.procurement_no,
                                    ReferenceNo: item?.ReferenceNo,
                                    uniqueId: item?.uniqueId,
                                    operation: 2
                                }
                            })
                        })
                    )
                }

                await prisma.$transaction([
                    prisma.da_pre_procurement_outbox.create({
                        data: inbox
                    }),
                    prisma.sr_pre_procurement_inbox.create({
                        data: inbox
                    }),
                    prisma.da_post_procurement_inbox.create({
                        data: inbox
                    }),
                    prisma.procurement_status.update({
                        where: {
                            procurement_no: inbox?.procurement_no
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
                            procurement_no: inbox?.procurement_no
                        },
                    })
                ])
            })
        )
        return "Released for tender"
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const releaseForTenderByProcNoDal = async (req: Request) => {
    const { procurement }: { procurement: string } = req.body
    const img = req.files
    const formattedProcurement = typeof (procurement) !== 'string' ? JSON.stringify(procurement) : procurement
    try {
        await Promise.all(
            JSON.parse(formattedProcurement).map(async (procurement_no: string) => {
                const inbox: number = await prisma.da_pre_procurement_inbox.count({
                    where: {
                        procurement_no: procurement_no
                    }
                })

                if (inbox === 0) {
                    throw { error: true, message: 'Invalid inbox ID' }
                }

                if (img) {
                    const uploaded = await imageUploader(img)   //It will return reference number and unique id as an object after uploading.

                    await Promise.all(
                        uploaded.map(async (item) => {
                            await prisma.note_sheet.create({
                                data: {
                                    procurement_no: procurement_no,
                                    ReferenceNo: item?.ReferenceNo,
                                    uniqueId: item?.uniqueId,
                                    operation: 2
                                }
                            })
                        })
                    )
                }

                await prisma.$transaction([
                    prisma.da_pre_procurement_outbox.create({
                        data: { procurement_no: procurement_no }
                    }),
                    prisma.sr_pre_procurement_inbox.create({
                        data: { procurement_no: procurement_no }
                    }),
                    prisma.da_post_procurement_inbox.create({
                        data: { procurement_no: procurement_no }
                    }),
                    prisma.procurement_status.update({
                        where: {
                            procurement_no: procurement_no
                        },
                        data: {
                            status: 2
                        }
                    }),
                    prisma.da_pre_procurement_inbox.delete({
                        where: {
                            procurement_no: procurement_no
                        },
                    }),
                    prisma.sr_pre_procurement_outbox.delete({
                        where: {
                            procurement_no: procurement_no
                        },
                    })
                ])
            })
        )
        return "Released for tender"
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const getPreProcurementOutboxDal = async (req: Request) => {
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
            brand_masterId: {
                in: brand
            }
        }
    }

    try {
        count = await prisma.da_pre_procurement_outbox.count({
            where: whereClause
        })
        const result = await prisma.da_pre_procurement_outbox.findMany({
            orderBy: {
                createdAt: 'desc'
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


export const getPreProcurementOutboxByIdDal = async (req: Request) => {
    const { id } = req.params
    try {
        const result: any = await prisma.da_pre_procurement_outbox.findFirst({
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


export const rejectByProcurementNoDal = async (req: Request) => {
    const { procurement_no, remark }: { procurement_no: string[], remark: string } = req.body
    try {
        procurement_no.map(async (item) => {
            await prisma.$transaction([

                prisma.da_pre_procurement_outbox.create({
                    data: { procurement_no: item }
                }),
                prisma.sr_pre_procurement_inbox.create({
                    data: { procurement_no: item }
                }),
                prisma.procurement.update({
                    where: {
                        procurement_no: item
                    },
                    data: {
                        remark: remark
                    }
                }),
                prisma.procurement_status.update({
                    where: {
                        procurement_no: item
                    },
                    data: {
                        status: -2
                    }
                }),
                prisma.da_pre_procurement_inbox.delete({
                    where: {
                        procurement_no: item
                    },
                }),
                prisma.sr_pre_procurement_outbox.delete({
                    where: {
                        procurement_no: item
                    },
                })

            ])
        })
        return "Rejected"
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const rejectDal = async (req: Request) => {
    const { preProcurement, remark }: { preProcurement: string[], remark: string } = req.body
    try {
        preProcurement.map(async (item) => {
            const inbox: any = await prisma.da_pre_procurement_inbox.findFirst({
                where: {
                    id: item
                },
                select: {
                    procurement_no: true
                }
            })
            if (inbox === null) {
                return
            }
            await prisma.$transaction([

                prisma.da_pre_procurement_outbox.create({
                    data: inbox
                }),
                prisma.sr_pre_procurement_inbox.create({
                    data: inbox
                }),
                prisma.procurement.update({
                    where: {
                        procurement_no: inbox?.procurement_no
                    },
                    data: {
                        remark: remark
                    }
                }),
                prisma.procurement_status.update({
                    where: {
                        procurement_no: inbox?.procurement_no
                    },
                    data: {
                        status: -2
                    }
                }),
                prisma.da_pre_procurement_inbox.delete({
                    where: {
                        id: item
                    },
                }),
                prisma.sr_pre_procurement_outbox.delete({
                    where: {
                        procurement_no: inbox?.procurement_no
                    },
                })

            ])
        })
        return "Reversed"
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const forwardToAccountantDal = async (req: Request) => {
    const { preProcurement }: { preProcurement: string } = req.body
    const img = req.files
    try {
        await Promise.all(
            JSON.parse(preProcurement).map(async (item: string) => {
                const inbox: any = await prisma.da_pre_procurement_inbox.findFirst({
                    where: {
                        id: item
                    },
                    select: {
                        procurement_no: true,
                    }
                })

                if (inbox === null) {
                    throw { error: true, message: 'Invalid inbox ID' }
                }

                if (img) {
                    const uploaded = await imageUploader(img)   //It will return reference number and unique id as an object after uploading.

                    await Promise.all(
                        uploaded.map(async (item) => {
                            await prisma.note_sheet.create({
                                data: {
                                    procurement_no: inbox?.procurement_no,
                                    ReferenceNo: item?.ReferenceNo,
                                    uniqueId: item?.uniqueId,
                                    operation: 11
                                }
                            })
                        })
                    )
                }

                await prisma.$transaction([
                    prisma.da_pre_procurement_outbox.create({
                        data: inbox
                    }),
                    prisma.acc_pre_procurement_inbox.create({
                        data: inbox
                    }),
                    prisma.procurement_status.update({
                        where: {
                            procurement_no: inbox?.procurement_no
                        },
                        data: {
                            status: 70
                        }
                    }),
                    prisma.da_pre_procurement_inbox.delete({
                        where: {
                            id: item
                        },
                    })
                ])
            })
        )
        return "Released for BOQ"
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const getBoqInboxDal = async (req: Request) => {
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
                reference_no: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            {
                boq: {
                    procurements: {
                        some: {
                            procurement: {
                                description: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        }
                    }
                }
            }
        ];
    }

    //creating filter options for the query
    if (category[0]) {
        whereClause.boq = {
            procurements: {
                some: {
                    procurement: {
                        category_masterId: {
                            in: category
                        }
                    }
                }
            }
        }
    }
    if (subcategory[0]) {
        whereClause.boq = {
            procurements: {
                some: {
                    procurement: {
                        subcategory_masterId: {
                            in: subcategory
                        }
                    }
                }
            }
        }
    }
    if (status[0]) {
        whereClause.boq = {
            status: {
                in: status.map(Number)
            }

        }
    }
    if (brand[0]) {
        whereClause.boq = {
            procurements: {
                some: {
                    procurement: {
                        brand_masterId: {
                            in: brand
                        }
                    }
                }
            }
        }
    }
    // whereClause.NOT = [
    //     {
    //         procurement: {
    //             status: {
    //                 status: -2
    //             }
    //         }
    //     },
    //     {
    //         procurement: {
    //             status: {
    //                 status: 2
    //             }
    //         }
    //     },
    // ]

    try {
        count = await prisma.da_boq_inbox.count({
            where: whereClause
        })
        const result = await prisma.da_boq_inbox.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                reference_no: true,
                boq: {
                    select: {
                        reference_no: true,
                        gst: true,
                        estimated_cost: true,
                        remark: true,
                        status: true,
                        isEdited: true,
                        procurements: {
                            select: {
                                procurement_no: true,
                                quantity: true,
                                unit: true,
                                rate: true,
                                amount: true,
                                remark: true,
                                procurement: {
                                    select: {
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
                                        description: true,
                                    }
                                }
                            }
                        },
                        boq_doc: {
                            select: {
                                ReferenceNo: true
                            }
                        }
                    },
                }
            }

        })


        await Promise.all(
            result.map(async (item) => {
                await Promise.all(
                    item?.boq?.boq_doc.map(async (doc: any) => {
                        const headers = {
                            "token": "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0"
                        }
                        await axios.post(process.env.DMS_GET || '', { "referenceNo": doc?.ReferenceNo }, { headers })
                            .then((response) => {
                                // console.log(response?.data?.data, 'res')
                                doc.imageUrl = response?.data?.data?.fullPath
                            }).catch((err) => {
                                // console.log(err?.data?.data, 'err')
                                // toReturn.push(err?.data?.data)
                                throw err
                            })
                    })
                )
            })
        )

        let dataToSend: any[] = []
        result.forEach((item: any) => {
            const updatedProcurements = item?.boq?.procurements.map((proc: any) => {
                const { procurement, ...rest } = proc;
                return { ...rest, ...procurement };
            });

            // Assign the updated array back to item.boq.procurements
            item.boq.procurements = updatedProcurements;

            //flatten the boq object
            const { boq, ...rest } = item;
            dataToSend.push({ ...rest, ...boq })
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
            data: dataToSend,
            pagination: pagination
        }
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const getBoqOutboxDal = async (req: Request) => {
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
                reference_no: {
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
        whereClause.boq = {
            procurements: {
                some: {
                    procurement: {
                        category_masterId: {
                            in: category
                        }
                    }
                }
            }
        }
    }
    if (subcategory[0]) {
        whereClause.boq = {
            procurements: {
                some: {
                    procurement: {
                        subcategory_masterId: {
                            in: subcategory
                        }
                    }
                }
            }
        }
    }
    if (status[0]) {
        whereClause.boq = {
            status: {
                in: status.map(Number)
            }

        }
    }
    if (brand[0]) {
        whereClause.boq = {
            procurements: {
                some: {
                    procurement: {
                        brand_masterId: {
                            in: brand
                        }
                    }
                }
            }
        }
    }
    // whereClause.NOT = [
    //     {
    //         procurement: {
    //             status: {
    //                 status: -2
    //             }
    //         }
    //     },
    //     {
    //         procurement: {
    //             status: {
    //                 status: 2
    //             }
    //         }
    //     },
    // ]

    try {
        count = await prisma.da_boq_outbox.count({
            where: whereClause
        })
        const result = await prisma.da_boq_outbox.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                reference_no: true,
                boq: {
                    select: {
                        reference_no: true,
                        gst: true,
                        estimated_cost: true,
                        remark: true,
                        status: true,
                        isEdited: true,
                        procurements: {
                            select: {
                                procurement_no: true,
                                quantity: true,
                                unit: true,
                                rate: true,
                                amount: true,
                                remark: true,
                                procurement: {
                                    select: {
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
                                        description: true,
                                    }
                                }
                            }
                        },
                        boq_doc: {
                            select: {
                                ReferenceNo: true
                            }
                        }
                    },
                }
            }

        })


        await Promise.all(
            result.map(async (item) => {
                await Promise.all(
                    item?.boq?.boq_doc.map(async (doc: any) => {
                        const headers = {
                            "token": "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0"
                        }
                        await axios.post(process.env.DMS_GET || '', { "referenceNo": doc?.ReferenceNo }, { headers })
                            .then((response) => {
                                // console.log(response?.data?.data, 'res')
                                doc.imageUrl = response?.data?.data?.fullPath
                            }).catch((err) => {
                                // console.log(err?.data?.data, 'err')
                                // toReturn.push(err?.data?.data)
                                throw err
                            })
                    })
                )
            })
        )

        let dataToSend: any[] = []
        result.forEach((item: any) => {
            const updatedProcurements = item?.boq?.procurements.map((proc: any) => {
                const { procurement, ...rest } = proc;
                return { ...rest, ...procurement };
            });

            // Assign the updated array back to item.boq.procurements
            item.boq.procurements = updatedProcurements;

            //flatten the boq object
            const { boq, ...rest } = item;
            dataToSend.push({ ...rest, ...boq })
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
            data: dataToSend,
            pagination: pagination
        }
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const returnToAccountantDal = async (req: Request) => {
    const { reference_no, remark }: { reference_no: string, remark: string } = req.body
    try {

        const boqData = await prisma.boq.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                status: true
            }
        })

        if (boqData?.status !== 0 && boqData?.status !== 1) {
            throw { error: true, message: 'Invalid status of BOQ for returning back to accountant' }
        }

        if (!remark) {
            throw { error: true, message: 'Remark is mandatory' }
        }

        //start transaction
        await prisma.$transaction(async (tx) => {

            await tx.da_boq_inbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.acc_boq_inbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.da_boq_outbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.acc_boq_outbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.boq.update({
                where: {
                    reference_no: reference_no
                },
                data: {
                    status: -1,
                    remark: remark
                }
            })

        })

        return "Returned to accountant"
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const rejectBoqDal = async (req: Request) => {
    const { reference_no, remark }: { reference_no: string, remark: string } = req.body
    try {

        const boqData = await prisma.boq.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                status: true,
                procurements: {
                    select: {
                        procurement_no: true
                    }
                }
            }
        })

        if (boqData?.status !== 0) {
            throw { error: true, message: 'Invalid status of BOQ for rejecting' }
        }

        if (!remark) {
            throw { error: true, message: 'Remark is mandatory' }
        }

        //start transaction
        await prisma.$transaction(async (tx) => {

            await tx.da_boq_inbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.acc_boq_inbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.da_boq_outbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.acc_boq_outbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.boq.update({
                where: {
                    reference_no: reference_no
                },
                data: {
                    status: -2,
                    remark: remark
                }
            })

            const procurement_no_array = boqData?.procurements.map((item) => item?.procurement_no)

            req.body = {
                procurement_no: procurement_no_array,
                remark: 'BOQ rejected'
            }
            const result: any = await rejectByProcurementNoDal(req)
            if (result?.error) {
                throw { error: true, message: 'Error while rejecting procurement' }
            }

        })



        return "Rejected"
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const getPreTenderingInboxDal = async (req: Request) => {
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
                reference_no: {
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
    if (category[0] || subcategory[0] || brand[0]) {
        whereClause.AND = [
            ...(category[0] ? [{
                boq: {
                    procurements: {
                        some: {
                            procurement: {
                                category_masterId: {
                                    in: category
                                }
                            }
                        }
                    }
                }
            }] : []),

            ...(subcategory[0] ? [{
                boq: {
                    procurements: {
                        some: {
                            procurement: {
                                subcategory_masterId: {
                                    in: subcategory
                                }
                            }
                        }
                    }
                }
            }] : []),

            ...(brand[0] ? [{
                boq: {
                    status: {
                        in: status.map(Number)
                    }

                }
            }] : []),

            ...(brand[0] ? [{
                boq: {
                    procurements: {
                        some: {
                            procurement: {
                                brand_masterId: {
                                    in: brand
                                }
                            }
                        }
                    }
                }
            }] : []),
        ]
    }

    try {
        count = await prisma.da_pre_tender_inbox.count({
            where: whereClause
        })
        const result = await prisma.da_pre_tender_inbox.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                reference_no: true,
                tendering_form: {
                    select: {
                        boq: {
                            select: {
                                procurements: {
                                    select: {
                                        procurement: {
                                            select: {
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
                                            }
                                        }
                                    }
                                }
                            },
                        },
                        status: true,
                        isEdited: true,
                        isPartial: true,
                        remark: true
                    }
                }
            }

        })

        let dataToSend: any[] = []
        result.forEach((item: any) => {
            const updatedProcurements = item?.tendering_form?.boq?.procurements[0].procurement;
            // Assign the updated array back
            item.tendering_form.boq.procurements = updatedProcurements;

            // Flatten the tendering_form object
            const { tendering_form, ...restData } = item;
            delete tendering_form.boq
            dataToSend.push({ ...restData, ...updatedProcurements, ...tendering_form })
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
            data: dataToSend,
            pagination: pagination
        }
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const getPreTenderingOutboxDal = async (req: Request) => {
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
                reference_no: {
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
    if (category[0] || subcategory[0] || brand[0]) {
        whereClause.AND = [
            ...(category[0] ? [{
                boq: {
                    procurements: {
                        some: {
                            procurement: {
                                category_masterId: {
                                    in: category
                                }
                            }
                        }
                    }
                }
            }] : []),

            ...(subcategory[0] ? [{
                boq: {
                    procurements: {
                        some: {
                            procurement: {
                                subcategory_masterId: {
                                    in: subcategory
                                }
                            }
                        }
                    }
                }
            }] : []),

            ...(brand[0] ? [{
                boq: {
                    status: {
                        in: status.map(Number)
                    }

                }
            }] : []),

            ...(brand[0] ? [{
                boq: {
                    procurements: {
                        some: {
                            procurement: {
                                brand_masterId: {
                                    in: brand
                                }
                            }
                        }
                    }
                }
            }] : []),
        ]
    }

    try {
        count = await prisma.da_pre_tender_outbox.count({
            where: whereClause
        })
        const result = await prisma.da_pre_tender_outbox.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                reference_no: true,
                tendering_form: {
                    select: {
                        boq: {
                            select: {
                                procurements: {
                                    select: {
                                        procurement: {
                                            select: {
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
                                            }
                                        }
                                    }
                                }
                            },
                        },
                        status: true,
                        isEdited: true,
                        isPartial: true,
                        remark: true
                    }
                }
            }

        })

        let dataToSend: any[] = []
        result.forEach((item: any) => {
            const updatedProcurements = item?.tendering_form?.boq?.procurements[0].procurement;
            // Assign the updated array back
            item.tendering_form.boq.procurements = updatedProcurements;

            // Flatten the tendering_form object
            const { tendering_form, ...restData } = item;
            delete tendering_form.boq
            dataToSend.push({ ...restData, ...updatedProcurements, ...tendering_form })
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
            data: dataToSend,
            pagination: pagination
        }
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const approveBoqForPtDal = async (req: Request) => {
    const { reference_no }: { reference_no: string } = req.body
    try {

        const boqData = await prisma.boq.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                status: true
            }
        })

        if (boqData?.status !== 0 && boqData?.status !== 1) {
            throw { error: true, message: 'Invalid status of BOQ to be approved' }
        }

        //start transaction
        await prisma.$transaction(async (tx) => {

            await tx.da_boq_inbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.acc_boq_inbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.da_boq_outbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.acc_boq_outbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.boq.update({
                where: {
                    reference_no: reference_no
                },
                data: {
                    status: 2,
                    remark: '' as string
                }
            })

        })

        return "Approved for pre tender"
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const approvePreTenderDal = async (req: Request) => {
    const { reference_no }: { reference_no: string } = req.body
    try {

        const preTenderData = await prisma.tendering_form.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                status: true,
                isPartial: true,
                boq: {
                    select: {
                        procurements: {
                            select: {
                                procurement_no: true
                            }
                        }
                    }
                }
            }
        })

        if (preTenderData?.status !== 1 && preTenderData?.status !== 69) {
            throw { error: true, message: 'Invalid status of pre tender to be approved' }
        }

        if (preTenderData?.isPartial) {
            throw { error: true, message: 'Pre tender form is partially filled' }
        }

        // start transaction
        await prisma.$transaction(async (tx) => {

            await tx.da_pre_tender_inbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.acc_pre_tender_inbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.da_pre_tender_outbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.acc_pre_tender_outbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.tendering_form.update({
                where: {
                    reference_no: reference_no
                },
                data: {
                    status: 2,
                    remark: '' as string
                }
            })

            const procurement = preTenderData?.boq?.procurements.map((item) => item?.procurement_no)  //append all procurement numbers inside an array to send

            //update the original procurement using BOQ procurement which was approved
            await Promise.all(
                procurement.map(async (procurement_no: string) => {

                    const proc: any = await prisma.procurement.findFirst({
                        where: {
                            procurement_no: procurement_no
                        },
                        select: {
                            procurement_no: true,
                            category_masterId: true,
                            subcategory_masterId: true,
                            brand_masterId: true,
                            description: true,
                            quantity: true,
                            rate: true,
                            unit: true,
                            total_rate: true,
                            remark: true
                        }
                    })

                    console.log(proc)

                    const boqProc = await prisma.boq_procurement.findFirst({
                        where: {
                            procurement_no: procurement_no
                        },
                        select: {
                            unit: true,
                            rate: true,
                            amount: true,
                            remark: true
                        }
                    })

                    await tx.procurement_before_boq.create({
                        data: proc
                    })

                    await tx.procurement.update({
                        where: {
                            procurement_no: procurement_no
                        },
                        data: {
                            rate: boqProc?.rate,
                            total_rate: boqProc?.amount,
                            remark: boqProc?.remark,
                            unit: boqProc?.unit
                        }
                    })

                })
            )

            req.body.procurement = procurement

            const result: any = await releaseForTenderByProcNoDal(req)
            if (result?.error) {
                throw { error: true, message: 'Error while releasing procurement' }
            }

        })

        return "Released for tender"
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const rejectPreTenderDal = async (req: Request) => {
    const { reference_no, remark }: { reference_no: string, remark: string } = req.body
    try {

        const preTenderData = await prisma.tendering_form.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                status: true,
                isPartial: true,
            }
        })

        if (preTenderData?.status !== 1 && preTenderData?.status !== 69) {
            throw { error: true, message: 'Invalid status of pre tender to be rejected' }
        }

        if (preTenderData?.isPartial) {
            throw { error: true, message: 'Pre tender form is partially filled' }
        }

        // start transaction
        await prisma.$transaction(async (tx) => {

            await tx.da_pre_tender_inbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.acc_pre_tender_inbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.da_pre_tender_outbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.acc_pre_tender_outbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.tendering_form.update({
                where: {
                    reference_no: reference_no
                },
                data: {
                    status: -2,
                    remark: remark as string
                }
            })

            req.body = {
                reference_no: reference_no,
                remark: 'Pre tender rejected'
            }

            const result: any = await rejectBoqDal(req)
            if (result?.error) {
                throw { error: true, message: 'Error while rejecting BOQ' }
            }

        })

        return "Released for tender"
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const returnToAccPtDal = async (req: Request) => {
    const { reference_no, remark }: { reference_no: string, remark: string } = req.body
    try {

        const preTenderData = await prisma.tendering_form.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                status: true,
                isPartial: true,
            }
        })

        if (preTenderData?.status !== 1 && preTenderData?.status !== 69) {
            throw { error: true, message: 'Invalid status of pre tender to be rejected' }
        }

        if (preTenderData?.isPartial) {
            throw { error: true, message: 'Pre tender form is partially filled' }
        }

        // start transaction
        await prisma.$transaction(async (tx) => {

            await tx.da_pre_tender_inbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.acc_pre_tender_inbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.da_pre_tender_outbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.acc_pre_tender_outbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.tendering_form.update({
                where: {
                    reference_no: reference_no
                },
                data: {
                    status: -1,
                    remark: remark as string
                }
            })

        })

        return "Returned to accountant"
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}
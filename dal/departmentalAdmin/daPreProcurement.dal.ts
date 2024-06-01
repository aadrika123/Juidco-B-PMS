import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import getErrorMessage from "../../lib/getErrorMessage";
import { imageUploader } from "../../lib/imageUploader";
import { pagination } from "../../type/common.type";


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
    const { preProcurement }: { preProcurement: string[] } = req.body
    const img = req.files
    try {
        await Promise.all(
            preProcurement.map(async (item) => {
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


export const getPreProcurementOutboxtByIdDal = async (req: Request) => {
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
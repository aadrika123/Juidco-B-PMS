import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import getErrorMessage from "../../lib/getErrorMessage";
import { imageUploader } from "../../lib/imageUploader";
import { pagination, uploadedDoc } from "../../type/common.type";
import { boqData } from "../../type/accountant.type";
import generateReferenceNumber from "../../lib/referenceNumberGenerator";


const prisma = new PrismaClient()


export const getPreProcurementForBoqDal = async (req: Request) => {
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
    // const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]

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



    if (category[0] || subcategory[0] || brand[0]) {
        whereClause.AND = [
            ...(category[0] ? [{
                procurement: {
                    category_masterId: {
                        in: category
                    }
                }
            }]:[]),
            ...(subcategory[0] ? [{
                procurement: {
                    subcategory_masterId: {
                        in: subcategory
                    }
                }
            }]:[]),
            ...(brand[0] ? [{
                procurement: {
                    brand_masterId: {
                        in: brand
                    }
                }
            }]:[])
        ];
    }






    // //creating filter options for the query
    // if (category[0]) {
    //     whereClause.procurement = {
    //         category_masterId: {
    //             in: category
    //         }
    //     }
    // }
    // if (subcategory[0]) {
    //     whereClause.procurement = {
    //         subcategory_masterId: {
    //             in: subcategory
    //         }
    //     }
    // }
    // if (brand[0]) {
    //     whereClause.procurement = {
    //         brand_masterId: {
    //             in: brand
    //         }
    //     }
    // }
    // if (status[0]) {
    //     whereClause.procurement = {
    //         status: {
    //             status: {
    //                 in: status.map(Number)
    //             }
    //         }
    //     }
    // }
    whereClause.procurement = {
        status: {
            status: 70
        }
    }

    try {

        count = await prisma.acc_pre_procurement_inbox.count({
            where: whereClause
        })
        const result = await prisma.acc_pre_procurement_inbox.findMany({
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
                status: {
                    in: status.map(Number)
                }
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
    // whereClause.NOT = [
    //     {
    //         procurement: {
    //             status: {
    //                 status: -70
    //             }
    //         }
    //     },
    //     {
    //         procurement: {
    //             status: {
    //                 status: 70
    //             }
    //         }
    //     },
    // ]

    try {
        count = await prisma.acc_pre_procurement_inbox.count({
            where: whereClause
        })
        const result = await prisma.acc_pre_procurement_inbox.findMany({
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



export const getPreProcurementBulkByOrderNoDal = async (req: Request) => {
    const { procurement_no }: { procurement_no: string[] } = req.body
    let resultToSend: any = []
    try {
        await Promise.all(
            procurement_no.map(async (item: string) => {
                const result: any = await prisma.procurement.findFirst({
                    where: {
                        procurement_no: item
                    },
                    select: {
                        id: true,
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


                })

                resultToSend.push(result)
            })
        )

        return resultToSend
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const createBoqDal = async (req: Request) => {
    const { boqData } = req.body
    try {
        const formattedBoqData: boqData = JSON.parse(boqData)
        const img = req.files as Express.Multer.File[]
        let arrayToSend: any[] = []
        let docToSend: any[] = []

        const reference_no: string = generateReferenceNumber(formattedBoqData?.ulb_id)

        await Promise.all(
            formattedBoqData?.procurement.map(async (item) => {
                const preparedData = {
                    reference_no: reference_no,
                    procurement_no: item?.procurement_no,
                    quantity: item?.quantity,
                    unit: item?.unit,
                    rate: item?.rate,
                    amount: item?.amount,
                    remark: item?.remark
                }

                const status = await prisma.procurement_status.findFirst({
                    where: {
                        procurement_no: item?.procurement_no
                    },
                    select: {
                        status: true
                    }
                })

                if (status?.status !== 70) {
                    throw { error: true, message: `Procurement : ${item?.procurement_no} is not valid for BOQ` }
                }

                arrayToSend.push(preparedData)
            })
        )

        const preparedBoq = {
            reference_no: reference_no,
            gst: formattedBoqData?.gst,
            estimated_cost: formattedBoqData?.estimated_cost,
            remark: formattedBoqData?.remark
        }

        if (img) {
            const uploaded: uploadedDoc[] = await imageUploader(img)   //It will return reference number and unique id as an object after uploading.

            uploaded.map((doc: uploadedDoc) => {
                const preparedBoqDoc = {
                    reference_no: reference_no,
                    ReferenceNo: doc?.ReferenceNo,
                    uniqueId: doc?.uniqueId,
                    remark: formattedBoqData?.remark
                }
                docToSend.push(preparedBoqDoc)
            })

        }

        //start transaction
        await prisma.$transaction(async (tx) => {

            await tx.boq.create({
                data: preparedBoq
            })

            await tx.boq_procurement.createMany({
                data: arrayToSend
            })

            if (img) {
                await tx.boq_doc.createMany({
                    data: docToSend
                })
            }

            await Promise.all(
                formattedBoqData?.procurement.map(async (item) => {
                    await tx.procurement_status.update({
                        where: {
                            procurement_no: item?.procurement_no
                        },
                        data: {
                            status: 71
                        }
                    })
                    await tx.acc_pre_procurement_inbox.delete({
                        where: {
                            procurement_no: item?.procurement_no
                        }
                    })
                    await tx.acc_pre_procurement_outbox.create({
                        data: {
                            procurement_no: item?.procurement_no
                        }
                    })
                    await tx.da_pre_procurement_outbox.delete({
                        where: {
                            procurement_no: item?.procurement_no
                        }
                    })
                    await tx.da_pre_procurement_inbox.create({
                        data: {
                            procurement_no: item?.procurement_no
                        }
                    })
                })
            )

            await tx.acc_boq_outbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.da_boq_inbox.create({
                data: {
                    reference_no: reference_no
                }
            })

        })

        return "BOQ Created"
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
                status: {
                    in: status.map(Number)
                }
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
    // whereClause.NOT = [
    //     {
    //         procurement: {
    //             status: {
    //                 status: -70
    //             }
    //         }
    //     },
    //     {
    //         procurement: {
    //             status: {
    //                 status: 70
    //             }
    //         }
    //     },
    // ]

    try {
        count = await prisma.acc_pre_procurement_outbox.count({
            where: whereClause
        })
        const result = await prisma.acc_pre_procurement_outbox.findMany({
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
        count = await prisma.acc_boq_inbox.count({
            where: whereClause
        })
        const result = await prisma.acc_boq_inbox.findMany({
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
                }
            }

        })

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
        count = await prisma.acc_boq_outbox.count({
            where: whereClause
        })
        const result = await prisma.acc_boq_outbox.findMany({
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
                        }
                    },
                }
            }

        })

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



export const forwardToDaDal = async (req: Request) => {
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

        //start transaction
        await prisma.$transaction(async (tx) => {

            await tx.acc_boq_inbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            await tx.acc_boq_outbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.da_boq_inbox.create({
                data: {
                    reference_no: reference_no
                }
            })

            await tx.da_boq_outbox.delete({
                where: {
                    reference_no: reference_no
                }
            })

            if (boqData?.status === -1) {
                await tx.boq.update({
                    where: {
                        reference_no: reference_no
                    },
                    data: {
                        status: 1
                    }
                })
            }

        })

        return "Forwarded to DA"
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

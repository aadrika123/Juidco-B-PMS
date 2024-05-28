import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import generateReceivingNumber from "../../lib/receivingNumberGenerator";
import { imageUploader } from "../../lib/imageUploader";
import axios from 'axios'


const prisma = new PrismaClient()
const dmsUrlGet = process.env.DMS_GET || ''


export const getReceivedInventoryDal = async (req: Request) => {
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
        count = await prisma.da_received_inventory_inbox.count({
            where: whereClause
        })
        const result: any = await prisma.da_received_inventory_inbox.findMany({
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
                is_gst_added: true,
            }
        })

        let resultToSend: any[] = []
        await Promise.all(
            result.map(async (item: any) => {
                const tempPreProcurement = { ...item?.pre_procurement }
                delete tempPreProcurement.id
                delete tempPreProcurement.createdAt
                delete tempPreProcurement.updatedAt
                delete tempPreProcurement.statusId
                delete item.pre_procurement

                const receivings = await prisma.receivings.findMany({
                    where: {
                        order_no: item?.order_no
                    },
                    select: {
                        order_no: true,
                        receiving_no: true,
                        date: true,
                        received_quantity: true,
                        remaining_quantity: true,
                        is_added: true,
                        receiving_image: {
                            select: {
                                ReferenceNo: true,
                                uniqueId: true,
                                receiving_no: true
                            }
                        }
                    }
                })


                await Promise.all(
                    receivings.map(async (receiving: any) => {
                        await Promise.all(
                            receiving?.receiving_image.map(async (img: any) => {
                                const headers = {
                                    "token": "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0"
                                }
                                await axios.post(dmsUrlGet, { "referenceNo": img?.ReferenceNo }, { headers })
                                    .then((response) => {
                                        // console.log(response?.data?.data, 'res')
                                        img.imageUrl = response?.data?.data?.fullPath
                                    }).catch((err) => {
                                        // console.log(err?.data?.data, 'err')
                                        // toReturn.push(err?.data?.data)
                                        throw err
                                    })
                            })
                        )
                    })
                )

                resultToSend.push({ ...item, ...tempPreProcurement, receivings: receivings })
            })
        )

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


export const getReceivedInventoryByIdDal = async (req: Request) => {
    const { id } = req.params
    let resultToSend: any = {}
    try {
        const result = await prisma.da_received_inventory_inbox.findFirst({
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
        const totalReceiving: any = await prisma.receivings.aggregate({
            where: {
                order_no: result?.order_no || ''
            },
            _sum: {
                received_quantity: true
            }
        })

        const receivings = await prisma.receivings.findMany({
            where: {
                order_no: result?.order_no || ''
            },
            select: {
                order_no: true,
                receiving_no: true,
                date: true,
                received_quantity: true,
                remaining_quantity: true,
                is_added: true,
                receiving_image: {
                    select: {
                        ReferenceNo: true,
                        uniqueId: true,
                        receiving_no: true
                    }
                }
            }
        })

        await Promise.all(
            receivings.map(async (receiving: any) => {
                await Promise.all(
                    receiving?.receiving_image.map(async (img: any) => {
                        const headers = {
                            "token": "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0"
                        }
                        await axios.post(dmsUrlGet, { "referenceNo": img?.ReferenceNo }, { headers })
                            .then((response) => {
                                // console.log(response?.data?.data, 'res')
                                img.imageUrl = response?.data?.data?.fullPath
                            }).catch((err) => {
                                // console.log(err?.data?.data, 'err')
                                // toReturn.push(err?.data?.data)
                                throw err
                            })
                    })
                )
            })
        )

        resultToSend = { ...result, receivings: receivings, total_receivings: totalReceiving?._sum?.received_quantity }

        return resultToSend
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}


export const getReceivedInventoryByOrderNoDal = async (req: Request) => {
    const { order_no } = req.params
    let resultToSend: any = {}
    try {
        const result = await prisma.da_received_inventory_inbox.findFirst({
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

        if (!result) {
            throw { error: true, message: 'Received Inventory with provided Order Number not found' }
        }

        const totalReceiving: any = await prisma.receivings.aggregate({
            where: {
                order_no: result?.order_no || ''
            },
            _sum: {
                received_quantity: true
            }
        })

        const receivings = await prisma.receivings.findMany({
            where: {
                order_no: order_no || ''
            },
            select: {
                order_no: true,
                receiving_no: true,
                date: true,
                received_quantity: true,
                remaining_quantity: true,
                is_added: true,
                receiving_image: {
                    select: {
                        ReferenceNo: true,
                        uniqueId: true,
                        receiving_no: true
                    }
                }
            }
        })

        await Promise.all(
            receivings.map(async (receiving: any) => {
                await Promise.all(
                    receiving?.receiving_image.map(async (img: any) => {
                        const headers = {
                            "token": "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0"
                        }
                        await axios.post(dmsUrlGet, { "referenceNo": img?.ReferenceNo }, { headers })
                            .then((response) => {
                                // console.log(response?.data?.data, 'res')
                                img.imageUrl = response?.data?.data?.fullPath
                            }).catch((err) => {
                                // console.log(err?.data?.data, 'err')
                                // toReturn.push(err?.data?.data)
                                throw err
                            })
                    })
                )
            })
        )

        resultToSend = { ...result, receivings: receivings, total_receivings: totalReceiving?._sum?.received_quantity }

        return resultToSend
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}



export const createReceivingDal = async (req: Request) => {
    const {
        order_no,
        date,
        received_quantity,
        remaining_quantity,
        ulb_id
    } = req.body
    const formattedDate = new Date(date)
    const img = req.files
    // console.log(img)
    try {
        const receiving_no = generateReceivingNumber(ulb_id)

        const data: any = {
            order_no: order_no,
            receiving_no: receiving_no,
            date: formattedDate,
            received_quantity: Number(received_quantity),
            remaining_quantity: Number(remaining_quantity)
        }

        const daRecInvIn: any = await prisma.da_received_inventory_inbox.findFirst({
            where: {
                order_no: order_no
            }
        })

        if (!daRecInvIn) {
            throw { error: true, message: `No received inventory with order number ${order_no} ` }
        }

        const totalReceiving: any = await prisma.receivings.aggregate({
            where: {
                order_no: order_no
            },
            _sum: {
                received_quantity: true
            }
        })

        //check for received quantity exceeding total allowed quantity
        if (totalReceiving?._sum?.received_quantity + Number(received_quantity) > daRecInvIn?.total_quantity) {
            throw { error: true, message: 'Provided received quantity will make the total received quantity more than the quantity that can be received' }
        }

        // check for valid remaining quantity
        if (totalReceiving?._sum?.received_quantity + Number(received_quantity) + Number(remaining_quantity) !== daRecInvIn?.total_quantity) {
            throw { error: true, message: 'Provided remaining quantity is invalid' }
        }

        const createdReceiving = await prisma.receivings.create({
            data: data
        })

        if (!createdReceiving) {
            throw 'Error while creating receiving'
        }

        if (img) {
            const uploaded = await imageUploader(img)   //It will return reference number and unique id as an object after uploading.

            await Promise.all(
                uploaded.map(async (item) => {
                    await prisma.receiving_image.create({
                        data: {
                            receiving_no: receiving_no,
                            ReferenceNo: item?.ReferenceNo,
                            uniqueId: item?.uniqueId
                        }
                    })
                })
            )
        }

        const outboxCount = await prisma.da_received_inventory_outbox.count({
            where: {
                order_no: order_no
            }
        })

        //check for fully received
        const dataTocreate = { ...daRecInvIn }
        delete dataTocreate.id
        delete dataTocreate.createdAt
        delete dataTocreate.updatedAt
        if (totalReceiving?._sum?.received_quantity + Number(received_quantity) === daRecInvIn?.total_quantity) {
            await prisma.$transaction([
                ...(outboxCount === 0 ? [prisma.da_received_inventory_outbox.create({
                    data: dataTocreate
                })] : []),
                prisma.da_received_inventory_inbox.delete({
                    where: {
                        id: daRecInvIn?.id
                    }
                }),
                prisma.procurement_status.update({
                    data: {
                        status: 5
                    },
                    where: {
                        id: daRecInvIn?.statusId
                    }
                }),
                prisma.da_received_inventory_outbox.update({
                    where: {
                        order_no: order_no
                    },
                    data: {
                        is_partial: false
                    }
                }),
                prisma.sr_received_inventory_inbox.update({
                    where: {
                        order_no: order_no
                    },
                    data: {
                        is_partial: false
                    }
                })
            ])
        } else {
            await prisma.$transaction([
                ...(outboxCount === 0 ? [prisma.da_received_inventory_outbox.create({
                    data: dataTocreate
                })] : []),
                prisma.procurement_status.update({
                    data: {
                        status: 4
                    },
                    where: {
                        id: daRecInvIn?.statusId
                    }
                })
            ])
        }

        return 'Receiving created'
    } catch (err: any) {
        console.log(err)
        return { error: true, message: err?.message }
    }
}



export const getReceivedInventoryOutboxDal = async (req: Request) => {
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
        count = await prisma.da_received_inventory_outbox.count({
            where: whereClause
        })
        const result: any = await prisma.da_received_inventory_outbox.findMany({
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
                is_gst_added: true,
            }
        })

        let resultToSend: any[] = []
        await Promise.all(
            result.map(async (item: any) => {
                const tempPreProcurement = { ...item?.pre_procurement }
                delete tempPreProcurement.id
                delete tempPreProcurement.createdAt
                delete tempPreProcurement.updatedAt
                delete tempPreProcurement.statusId
                delete item.pre_procurement

                const receivings = await prisma.receivings.findMany({
                    where: {
                        order_no: item?.order_no
                    },
                    select: {
                        order_no: true,
                        receiving_no: true,
                        date: true,
                        received_quantity: true,
                        remaining_quantity: true,
                        is_added: true,
                        receiving_image: {
                            select: {
                                ReferenceNo: true,
                                uniqueId: true,
                                receiving_no: true
                            }
                        }
                    }
                })


                await Promise.all(
                    receivings.map(async (receiving: any) => {
                        await Promise.all(
                            receiving?.receiving_image.map(async (img: any) => {
                                const headers = {
                                    "token": "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0"
                                }
                                await axios.post(dmsUrlGet, { "referenceNo": img?.ReferenceNo }, { headers })
                                    .then((response) => {
                                        // console.log(response?.data?.data, 'res')
                                        img.imageUrl = response?.data?.data?.fullPath
                                    }).catch((err) => {
                                        // console.log(err?.data?.data, 'err')
                                        // toReturn.push(err?.data?.data)
                                        throw err
                                    })
                            })
                        )
                    })
                )

                resultToSend.push({ ...item, ...tempPreProcurement, receivings: receivings })
            })
        )

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


export const getReceivedInventoryOutboxByIdDal = async (req: Request) => {
    const { id } = req.params
    let resultToSend: any = {}
    try {
        const result = await prisma.da_received_inventory_outbox.findFirst({
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
        const totalReceiving: any = await prisma.receivings.aggregate({
            where: {
                order_no: result?.order_no || ''
            },
            _sum: {
                received_quantity: true
            }
        })

        const receivings = await prisma.receivings.findMany({
            where: {
                order_no: result?.order_no || ''
            },
            select: {
                order_no: true,
                receiving_no: true,
                date: true,
                received_quantity: true,
                remaining_quantity: true,
                is_added: true,
                receiving_image: {
                    select: {
                        ReferenceNo: true,
                        uniqueId: true,
                        receiving_no: true
                    }
                }
            }
        })

        await Promise.all(
            receivings.map(async (receiving: any) => {
                await Promise.all(
                    receiving?.receiving_image.map(async (img: any) => {
                        const headers = {
                            "token": "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0"
                        }
                        await axios.post(dmsUrlGet, { "referenceNo": img?.ReferenceNo }, { headers })
                            .then((response) => {
                                // console.log(response?.data?.data, 'res')
                                img.imageUrl = response?.data?.data?.fullPath
                            }).catch((err) => {
                                // console.log(err?.data?.data, 'err')
                                // toReturn.push(err?.data?.data)
                                throw err
                            })
                    })
                )
            })
        )

        resultToSend = { ...result, receivings: receivings, total_receivings: totalReceiving?._sum?.received_quantity }

        return resultToSend
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}
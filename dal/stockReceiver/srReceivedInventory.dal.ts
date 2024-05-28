import { Request } from "express";
import { PrismaClient } from "@prisma/client";
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
        count = await prisma.sr_received_inventory_inbox.count({
            where: whereClause
        })
        const result: any = await prisma.sr_received_inventory_inbox.findMany({
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
                        remark:true,
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
        console.log(err)
        return { error: true, message: err?.message }
    }
}


export const getReceivedInventoryByIdDal = async (req: Request) => {
    const { id } = req.params
    let resultToSend: any = {}
    try {
        const result = await prisma.sr_received_inventory_inbox.findFirst({
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
                remark:true,
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

        resultToSend = { ...result, receivings: receivings }

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
        const result = await prisma.sr_received_inventory_inbox.findFirst({
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
                remark:true,
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

        resultToSend = { ...result, receivings: receivings }

        return resultToSend
    } catch (err: any) {
        console.log(err?.message)
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
        count = await prisma.sr_received_inventory_outbox.count({
            where: whereClause
        })
        const result: any = await prisma.sr_received_inventory_outbox.findMany({
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
                        order_no: item?.order_no || ''
                    },
                    select: {
                        order_no: true,
                        receiving_no: true,
                        date: true,
                        received_quantity: true,
                        remaining_quantity: true,
                        remark:true,
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
    let resultToSend: any[] = []
    try {
        const result = await prisma.sr_received_inventory_outbox.findFirst({
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
                remark:true,
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

        resultToSend.push({ ...result, receivings: receivings })

        return resultToSend
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: err?.message }
    }
}



export const addToInventoryDal = async (req: Request) => {
    const {
        order_no,
        dead_stock
    } = req.body
    const img = req.files
    // console.log(img)
    try {

        const totalNonAddedReceiving: any = await prisma.receivings.aggregate({
            where: {
                order_no: order_no || '',
                is_added: false
            },
            _sum: {
                received_quantity: true
            }
        })

        if (totalNonAddedReceiving?._sum?.received_quantity === null) {
            throw { error: true, message: 'No receiving to be added' }
        }

        const NonAddedReceiving: any = await prisma.receivings.findMany({
            where: {
                order_no: order_no || '',
                is_added: false
            }
        })

        await Promise.all(
            NonAddedReceiving.map(async (item: any) => {
                await prisma.receivings.update({
                    where: {
                        id: item?.id
                    },
                    data: {
                        is_added: true
                    }
                })
            })
        )

        if (dead_stock) {
            const prev_dead_stock = await prisma.dead_stock.findFirst({
                where: {
                    order_no: order_no
                }
            })

            if (prev_dead_stock) {
                await prisma.dead_stock.update({
                    where: {
                        order_no: order_no
                    },
                    data: {
                        quantity: Number(prev_dead_stock?.quantity) + Number(dead_stock)
                    }
                })
            } else {
                await prisma.dead_stock.create({
                    data: {
                        order_no: order_no,
                        quantity: Number(dead_stock)
                    }
                })
            }

            if (img) {
                const uploaded = await imageUploader(img)   //It will return reference number and unique id as an object after uploading.

                await Promise.all(
                    uploaded.map(async (item) => {
                        await prisma.dead_stock_image.create({
                            data: {
                                order_no: order_no,
                                ReferenceNo: item?.ReferenceNo,
                                uniqueId: item?.uniqueId
                            }
                        })
                    })
                )
            }

        }

        console.log(totalNonAddedReceiving)

        return {
            dead_stock: dead_stock || 0,
            total_Added_stock: dead_stock ? totalNonAddedReceiving?._sum?.received_quantity - Number(dead_stock) : totalNonAddedReceiving?._sum?.received_quantity
        }
    } catch (err: any) {
        console.log(err)
        return { error: true, message: err?.message }
    }
}
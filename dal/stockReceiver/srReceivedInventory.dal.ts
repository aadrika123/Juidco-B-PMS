import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { imageUploader } from "../../lib/imageUploader";
import axios from 'axios'
import getErrorMessage from "../../lib/getErrorMessage";


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
        count = await prisma.sr_received_inventory_inbox.count({
            where: whereClause
        })
        const result = await prisma.sr_received_inventory_inbox.findMany({
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
                        isEdited: true
                    }
                }
            }
        })

        let resultToSend: any[] = []
        await Promise.all(
            result.map(async (item: any) => {
                const temp = { ...item?.procurement }
                delete item.procurement

                const receivings = await prisma.receivings.findMany({
                    where: {
                        procurement_no: item?.procurement_no
                    },
                    select: {
                        procurement_no: true,
                        receiving_no: true,
                        date: true,
                        received_quantity: true,
                        remaining_quantity: true,
                        is_added: true,
                        remark: true,
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

                resultToSend.push({ ...item, ...temp, receivings: receivings })
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
        return { error: true, message: getErrorMessage(err) }
    }
}


export const getReceivedInventoryByIdDal = async (req: Request) => {
    const { id } = req.params
    let resultToSend: any = {}
    try {
        const result: any = await prisma.sr_received_inventory_inbox.findFirst({
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
                        isEdited: true
                    }
                }
            }
        })
        const totalReceiving: any = await prisma.receivings.aggregate({
            where: {
                procurement_no: result?.procurement_no || ''
            },
            _sum: {
                received_quantity: true
            }
        })

        const receivings = await prisma.receivings.findMany({
            where: {
                procurement_no: result?.procurement_no || ''
            },
            select: {
                procurement_no: true,
                receiving_no: true,
                date: true,
                received_quantity: true,
                remaining_quantity: true,
                is_added: true,
                remark: true,
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

        const temp = { ...result?.procurement }
        delete result.procurement

        resultToSend = { ...result, ...temp, receivings: receivings, total_receivings: totalReceiving?._sum?.received_quantity }

        return resultToSend
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: getErrorMessage(err) }
    }
}


export const getReceivedInventoryByOrderNoDal = async (req: Request) => {
    const { procurement_no } = req.params
    let resultToSend: any = {}
    try {
        const result: any = await prisma.sr_received_inventory_inbox.findFirst({
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
                        isEdited: true
                    }
                }
            }
        })

        if (!result) {
            throw { error: true, message: 'Received Inventory with provided Order Number not found' }
        }

        const totalReceiving: any = await prisma.receivings.aggregate({
            where: {
                procurement_no: result?.procurement_no || ''
            },
            _sum: {
                received_quantity: true
            }
        })

        const receivings = await prisma.receivings.findMany({
            where: {
                procurement_no: result?.procurement_no || ''
            },
            select: {
                procurement_no: true,
                receiving_no: true,
                date: true,
                received_quantity: true,
                remaining_quantity: true,
                is_added: true,
                remark: true,
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

        const temp = { ...result?.procurement }
        delete result.procurement

        resultToSend = { ...result, ...temp, receivings: receivings, total_receivings: totalReceiving?._sum?.received_quantity }

        return resultToSend
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: getErrorMessage(err) }
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
        count = await prisma.sr_received_inventory_outbox.count({
            where: whereClause
        })
        const result = await prisma.sr_received_inventory_outbox.findMany({
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
                        isEdited: true
                    }
                }
            }
        })

        let resultToSend: any[] = []
        await Promise.all(
            result.map(async (item: any) => {
                const temp = { ...item?.procurement }
                delete item.procurement

                const receivings = await prisma.receivings.findMany({
                    where: {
                        procurement_no: item?.procurement_no
                    },
                    select: {
                        procurement_no: true,
                        receiving_no: true,
                        date: true,
                        received_quantity: true,
                        remaining_quantity: true,
                        is_added: true,
                        remark: true,
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

                resultToSend.push({ ...item, ...temp, receivings: receivings })
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
        return { error: true, message: getErrorMessage(err) }
    }
}


export const getReceivedInventoryOutboxByIdDal = async (req: Request) => {
    const { id } = req.params
    let resultToSend: any = {}
    try {
        const result: any = await prisma.sr_received_inventory_outbox.findFirst({
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
                        isEdited: true
                    }
                }
            }
        })
        const totalReceiving: any = await prisma.receivings.aggregate({
            where: {
                procurement_no: result?.procurement_no || ''
            },
            _sum: {
                received_quantity: true
            }
        })

        const receivings = await prisma.receivings.findMany({
            where: {
                procurement_no: result?.procurement_no || ''
            },
            select: {
                procurement_no: true,
                receiving_no: true,
                date: true,
                received_quantity: true,
                remaining_quantity: true,
                is_added: true,
                remark: true,
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

        const temp = { ...result?.procurement }
        delete result.procurement

        resultToSend = { ...result, ...temp, receivings: receivings, total_receivings: totalReceiving?._sum?.received_quantity }

        return resultToSend
    } catch (err: any) {
        console.log(err?.message)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const addToInventoryDal = async (req: Request) => {
    const {
        procurement_no,
        dead_stock,
        inventory
    } = req.body
    const img = req.files
    // console.log(img)
    try {

        const totalNonAddedReceiving: any = await prisma.receivings.aggregate({
            where: {
                procurement_no: procurement_no || '',
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
                procurement_no: procurement_no || '',
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

        if (dead_stock && !img) {
            throw { error: true, message: 'If there is any dead stock, at least one image is mandatory.' }
        }

        if (dead_stock) {
            const prev_dead_stock = await prisma.dead_stock.findFirst({
                where: {
                    procurement_no: procurement_no
                }
            })

            if (prev_dead_stock) {
                await prisma.dead_stock.update({
                    where: {
                        procurement_no: procurement_no
                    },
                    data: {
                        quantity: Number(prev_dead_stock?.quantity) + Number(dead_stock)
                    }
                })
            } else {
                await prisma.dead_stock.create({
                    data: {
                        procurement_no: procurement_no,
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
                                procurement_no: procurement_no,
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
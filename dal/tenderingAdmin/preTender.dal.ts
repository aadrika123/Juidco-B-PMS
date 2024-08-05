import { Request } from "express";
import getErrorMessage from "../../lib/getErrorMessage";
import {
    PrismaClient,
} from "@prisma/client";

import { pagination } from "../../type/common.type";


const prisma = new PrismaClient()


export const getTaInboxDal = async (req: Request) => {
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
                        // category: {
                        //     select: {
                        //         name: true
                        //     }
                        // },
                        // subcategory: {
                        //     select: {
                        //         name: true
                        //     }
                        // },
                        // brand: {
                        //     select: {
                        //         name: true
                        //     }
                        // },
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
                        // description: true,
                        // quantity: true,
                        // rate: true,
                        total_rate: true,
                        isEdited: true,
                        remark: true,
                        // status: {
                        //     select: {
                        //         status: true
                        //     }
                        // }
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
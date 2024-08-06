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
    const creationstatus: any[] = Array.isArray(req?.query?.creationstatus) ? req?.query?.creationstatus : [req?.query?.creationstatus]

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
                bid_details: {
                    boq: {
                        pre_tendering_details: {
                            tendering_type: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            },
        ];
    }

    //creating filter options for the query
    if (category[0] || subcategory[0] || brand[0]) {
        whereClause.AND = [
            ...(category[0]
                ? [
                    {
                        bid_details: {
                            boq: {
                                procurement: {
                                    category_masterId: {
                                        in: category,
                                    },
                                }
                            },
                        },
                    },
                ]
                : []),
            ...(status[0]
                ? [
                    {
                        bid_details: {
                            status: {
                                in: status.map(Number),
                            },
                        },
                    },
                ]
                : []),
            ...(creationstatus[0]
                ? [
                    {
                        bid_details: {
                            creationStatus: {
                                in: creationstatus.map(Number),
                            },
                        },
                    },
                ]
                : []),
        ]
    }

    try {
        count = await prisma.ta_inbox.count({
            where: whereClause
        })
        const result = await prisma.ta_inbox.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                reference_no: true,
                bid_details: {
                    select: {
                        boq: {
                            select: {
                                estimated_cost: true,
                                procurement: {
                                    select: {
                                        category_masterId: true,
                                        category: {
                                            select: {
                                                id: true,
                                                name: true
                                            }
                                        }
                                    }
                                },
                                pre_tendering_details: {
                                    select: {
                                        tendering_type: true
                                    }
                                }
                            }
                        },
                        status: true,
                        creationStatus: true
                    }
                }
            }
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
            data: result,
            pagination: pagination
        }
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

export const getTaOutboxDal = async (req: Request) => {
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
    const creationstatus: any[] = Array.isArray(req?.query?.creationstatus) ? req?.query?.creationstatus : [req?.query?.creationstatus]

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
                bid_details: {
                    boq: {
                        pre_tendering_details: {
                            tendering_type: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            },
        ];
    }

    //creating filter options for the query
    if (category[0] || subcategory[0] || brand[0]) {
        whereClause.AND = [
            ...(category[0]
                ? [
                    {
                        bid_details: {
                            boq: {
                                procurement: {
                                    category_masterId: {
                                        in: category,
                                    },
                                }
                            },
                        },
                    },
                ]
                : []),
            ...(status[0]
                ? [
                    {
                        bid_details: {
                            status: {
                                in: status.map(Number),
                            },
                        },
                    },
                ]
                : []),
            ...(creationstatus[0]
                ? [
                    {
                        bid_details: {
                            creationStatus: {
                                in: creationstatus.map(Number),
                            },
                        },
                    },
                ]
                : []),
        ]
    }

    try {
        count = await prisma.ta_outbox.count({
            where: whereClause
        })
        const result = await prisma.ta_outbox.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                reference_no: true,
                bid_details: {
                    select: {
                        boq: {
                            select: {
                                estimated_cost: true,
                                procurement: {
                                    select: {
                                        category_masterId: true,
                                        category: {
                                            select: {
                                                id: true,
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        status: true,
                        creationStatus: true
                    }
                }
            }
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
            data: result,
            pagination: pagination
        }
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}
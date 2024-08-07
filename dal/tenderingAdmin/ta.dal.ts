import { Request } from "express";
import getErrorMessage from "../../lib/getErrorMessage";
import {
    bid_type_enum,
    bidder_master,
    criteria_type_enum,
    offline_mode_enum,
    payment_mode_enum,
    PrismaClient,
} from "@prisma/client";

import { pagination } from "../../type/common.type";
import { imageUploaderV2 } from "../../lib/imageUploaderV2";


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

export const selectBidTypeDal = async (req: Request) => {
    const { reference_no, bid_type }: { reference_no: string, bid_type: bid_type_enum } = req.body
    try {

        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        if (!bid_type) {
            throw { error: true, message: "Comparison type is required as 'comparison_type'" }
        }

        const preTenderDetailsCount = await prisma.pre_tendering_details.count({
            where: { reference_no: reference_no }
        })

        if (preTenderDetailsCount === 0) {
            throw { error: true, message: "No pre tender details found with this reference number" }
        }

        const boqData = await prisma.boq.findFirst({
            where: { reference_no: reference_no },
            select: { status: true }
        })

        if (boqData?.status === 70) {
            throw { error: true, message: "BOQ is not valid to proceed" }
        }

        const result = await prisma.bid_details.update({
            where: { reference_no: reference_no },
            data: {
                bid_type: bid_type,
                creationStatus: 1
            }
        })

        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

type criteriaType = {
    heading: string,
    description: string
}

type criteriaPayloadType = {
    reference_no: string,
    criteria: criteriaType[],
    criteria_type: criteria_type_enum
}

export const addCriteriaDal = async (req: Request) => {
    const { reference_no, criteria, criteria_type }: criteriaPayloadType = req.body
    try {

        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        if (criteria.length === 0) {
            throw { error: true, message: "Atleast one criteria is required as 'criteria[]'" }
        }

        if (!criteria_type) {
            throw { error: true, message: "Criteria type is required as 'criteria_type'" }
        }

        const preTenderDetailsCount = await prisma.pre_tendering_details.count({
            where: { reference_no: reference_no }
        })

        if (preTenderDetailsCount === 0) {
            throw { error: true, message: "No pre tender details found with this reference number" }
        }

        const bidDetailsData = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                creationStatus: true
            }
        })

        if (bidDetailsData?.creationStatus === 1) {
            throw { error: true, message: "Current creation status is not valid for this step " }
        }

        const addedCriteria = await prisma.criteria.findMany({
            where: {
                reference_no: reference_no
            }
        })

        const isAlreadyThere = addedCriteria.filter(item => item?.criteria_type === criteria_type)

        if (isAlreadyThere.length > 0) {
            throw { error: true, message: `Criteria type : ${criteria_type} is already added ` }
        }

        await prisma.$transaction(async (tx) => {
            await Promise.all(
                criteria.map(async (item) => {
                    await tx.criteria.create({
                        data: {
                            reference_no: reference_no,
                            heading: item?.heading,
                            description: item?.description,
                            criteria_type: criteria_type
                        }
                    })
                })
            )
            // await tx.bid_details.update({
            //     where: { reference_no: reference_no },
            //     data: {
            //         no_of_bidders: no_of_bidders,
            //         creationStatus: 2
            //     }
            // })
        })

        return `Criterias added for ${criteria_type} type `
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

export const submitCriteriaDal = async (req: Request) => {
    const { reference_no, no_of_bidders }: { reference_no: string, no_of_bidders: number } = req.body
    try {

        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        if (!no_of_bidders) {
            throw { error: true, message: "Number of bidders is required as 'no_of_bidders'" }
        }

        const preTenderDetailsCount = await prisma.pre_tendering_details.count({
            where: { reference_no: reference_no }
        })

        if (preTenderDetailsCount === 0) {
            throw { error: true, message: "No pre tender details found with this reference number" }
        }

        const bidDetailsData = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                creationStatus: true
            }
        })

        if (bidDetailsData?.creationStatus === 1) {
            throw { error: true, message: "Current creation status is not valid for this step " }
        }

        const addedCriteria = await prisma.criteria.findMany({
            where: {
                reference_no: reference_no
            }
        })

        if (addedCriteria.length < 2) {
            throw { error: true, message: `All required criterias are not added yet` }
        }

        await prisma.$transaction(async (tx) => {
            await tx.bid_details.update({
                where: { reference_no: reference_no },
                data: {
                    no_of_bidders: no_of_bidders,
                    creationStatus: 2
                }
            })
        })

        return `Criterias and no. of bidders are submitted successfully `
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

// type bidderPayloadType = {
//     bidder: Omit<bidder_master, 'id' | 'emd_doc' | 'bidder_doc' | 'createdAt' | 'updatedAt'>,
// }

export const addBidderDetailsDal = async (req: Request) => {
    const { bidder }: { bidder: string } = req.body
    const { emd_doc, bidder_doc } = (req.files as any) || {}
    try {

        const formattedBidder: Omit<bidder_master, 'id' | 'emd_doc' | 'bidder_doc' | 'createdAt' | 'updatedAt'> = JSON.parse(bidder)

        if (!formattedBidder) {
            throw { error: true, message: "Bidder details are mandatory" }
        }

        if (!formattedBidder?.reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        const preTenderDetailsCount = await prisma.pre_tendering_details.count({
            where: { reference_no: formattedBidder?.reference_no }
        })

        if (preTenderDetailsCount === 0) {
            throw { error: true, message: "No pre tender details found with this reference number" }
        }

        if (!emd_doc) {
            throw { error: true, message: "EMD document is required as 'emd_doc'" }
        }

        if (!bidder_doc) {
            throw { error: true, message: "Bidder document is required as 'bidder_doc'" }
        }

        const bidDetailsData = await prisma.bid_details.findFirst({
            where: { reference_no: formattedBidder?.reference_no },
            select: {
                creationStatus: true,
                no_of_bidders: true,
                _count: {
                    select: {
                        bidder_master: true
                    }
                }
            }
        })

        if (bidDetailsData) {
            const bidderCount = bidDetailsData?._count?.bidder_master || 0
            const no_of_bidders = bidDetailsData?.no_of_bidders || 0

            if (bidderCount >= no_of_bidders) {
                throw { error: true, message: "Requird bidders are already added" }
            }
        }

        if (bidDetailsData?.creationStatus === 2) {
            throw { error: true, message: "Current creation status is not valid for this step " }
        }

        const emd_doc_path = await imageUploaderV2(emd_doc)

        const bidder_doc_path = await imageUploaderV2(bidder_doc)

        await prisma.$transaction(async (tx) => {
            await tx.bidder_master.create({
                data: {
                    reference_no: formattedBidder?.reference_no,
                    name: formattedBidder?.reference_no,
                    gst_no: formattedBidder?.gst_no,
                    pan_no: formattedBidder?.pan_no,
                    address: formattedBidder?.address,
                    bank: formattedBidder?.bank,
                    account_no: formattedBidder?.account_no,
                    ifsc: formattedBidder?.ifsc,
                    emd: Boolean(formattedBidder?.emd),
                    emd_doc: emd_doc_path[0],
                    payment_mode: formattedBidder?.payment_mode as payment_mode_enum,
                    offline_mode: formattedBidder?.offline_mode as offline_mode_enum,
                    dd_no: formattedBidder?.dd_no,
                    transaction_no: formattedBidder?.transaction_no,
                    bidder_doc: bidder_doc_path[0],
                    bidding_amount: Number(formattedBidder?.bidding_amount),
                }
            })
        })

        return 'Bidder details added'
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

export const submitBidderDetailsDal = async (req: Request) => {
    const { reference_no }: { reference_no: String } = req.body
    try {

        if (reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        const preTenderDetailsCount = await prisma.pre_tendering_details.count({
            where: { reference_no: reference_no }
        })

        if (preTenderDetailsCount === 0) {
            throw { error: true, message: "No pre tender details found with this reference number" }
        }

        const bidDetailsData = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                creationStatus: true,
                no_of_bidders: true,
                _count: {
                    select: {
                        bidder_master: true
                    }
                }
            }
        })

        if (bidDetailsData) {
            const bidderCount = bidDetailsData?._count?.bidder_master || 0
            const no_of_bidders = bidDetailsData?.no_of_bidders || 0

            if (bidderCount !== no_of_bidders) {
                throw { error: true, message: "Total number of added bidders doesn't match the total declared number of bidders" }
            }
        }

        if (bidDetailsData?.creationStatus === 2) {
            throw { error: true, message: "Current creation status is not valid for this step " }
        }

        await prisma.$transaction(async (tx) => {
            await tx.bid_details.update({
                where: { reference_no: reference_no },
                data: {
                    creationStatus: 3
                }
            })
        })

        return 'Bidder details submitted'
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}
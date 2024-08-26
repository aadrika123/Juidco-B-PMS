import { Request } from 'express'
import getErrorMessage from '../../lib/getErrorMessage'
import { bid_type_enum, bidder_master, comparison_type_enum, criteria_type_enum, offline_mode_enum, payment_mode_enum, PrismaClient } from '@prisma/client'

import { pagination } from '../../type/common.type'
import { imageUploaderV2 } from '../../lib/imageUploaderV2'

const prisma = new PrismaClient()

export const getTaInboxDal = async (req: Request) => {
    const page: number | undefined = Number(req?.query?.page)
    const take: number | undefined = Number(req?.query?.take)
    const startIndex: number | undefined = (page - 1) * take
    const endIndex: number | undefined = startIndex + take
    let count: number
    let totalPage: number
    let pagination: pagination = {}
    const whereClause: any = {}

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
                    mode: 'insensitive',
                },
            },
            {
                boq: {
                    pre_tendering_details: {
                        tendering_type: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                },
            },
        ]
    }

    //creating filter options for the query
    if (category[0] || subcategory[0] || brand[0]) {
        whereClause.AND = [
            ...(category[0]
                ? [
                    {
                        boq: {
                            procurement: {
                                category_masterId: {
                                    in: category,
                                },
                            },
                        },
                    },
                ]
                : []),
            ...(status[0]
                ? [
                    {
                        boq: {
                            bid_details: {
                                status: {
                                    in: status.map(Number),
                                },
                            },
                        },
                    },
                ]
                : []),
            ...(creationstatus[0]
                ? [
                    {
                        boq: {
                            bid_details: {
                                creationStatus: {
                                    in: creationstatus.map(Number),
                                },
                            },
                        },
                    },
                ]
                : []),
        ]
    }

    try {
        count = await prisma.ta_inbox.count({
            where: whereClause,
        })
        const result = await prisma.ta_inbox.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                reference_no: true,
                boq: {
                    select: {
                        estimated_cost: true,
                        procurement: {
                            select: {
                                category_masterId: true,
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                        pre_tendering_details: {
                            select: {
                                tendering_type: true,
                            },
                        },
                        bid_details: {
                            select: {
                                status: true,
                                creationStatus: true,
                            },
                        },
                    },
                },
            },
        })

        totalPage = Math.ceil(count / take)
        if (endIndex < count) {
            pagination.next = {
                page: page + 1,
                take: take,
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                take: take,
            }
        }
        pagination.currentPage = page
        pagination.currentTake = take
        pagination.totalPage = totalPage
        pagination.totalResult = count
        return {
            data: result,
            pagination: pagination,
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
    const whereClause: any = {}

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
                    mode: 'insensitive',
                },
            },
            {
                boq: {
                    pre_tendering_details: {
                        tendering_type: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                },
            },
        ]
    }

    //creating filter options for the query
    if (category[0] || subcategory[0] || brand[0]) {
        whereClause.AND = [
            ...(category[0]
                ? [
                    {
                        boq: {
                            procurement: {
                                category_masterId: {
                                    in: category,
                                },
                            },
                        },
                    },
                ]
                : []),
            ...(status[0]
                ? [
                    {
                        boq: {
                            bid_details: {
                                status: {
                                    in: status.map(Number),
                                },
                            },
                        },
                    },
                ]
                : []),
            ...(creationstatus[0]
                ? [
                    {
                        boq: {
                            bid_details: {
                                creationStatus: {
                                    in: creationstatus.map(Number),
                                },
                            },
                        },
                    },
                ]
                : []),
        ]
    }

    try {
        count = await prisma.ta_outbox.count({
            where: whereClause,
        })
        const result = await prisma.ta_outbox.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            select: {
                id: true,
                reference_no: true,
                boq: {
                    select: {
                        estimated_cost: true,
                        procurement: {
                            select: {
                                category_masterId: true,
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                        pre_tendering_details: {
                            select: {
                                tendering_type: true,
                            },
                        },
                        bid_details: {
                            select: {
                                status: true,
                                creationStatus: true,
                            },
                        },
                    },
                },
            },
        })

        totalPage = Math.ceil(count / take)
        if (endIndex < count) {
            pagination.next = {
                page: page + 1,
                take: take,
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                take: take,
            }
        }
        pagination.currentPage = page
        pagination.currentTake = take
        pagination.totalPage = totalPage
        pagination.totalResult = count
        return {
            data: result,
            pagination: pagination,
        }
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

export const selectBidTypeDal = async (req: Request) => {
    const { reference_no, bid_type }: { reference_no: string; bid_type: bid_type_enum } = req.body
    try {
        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        if (!bid_type) {
            throw { error: true, message: "Comparison type is required as 'comparison_type'" }
        }

        const preTenderDetailsCount = await prisma.pre_tendering_details.count({
            where: { reference_no: reference_no },
        })

        if (preTenderDetailsCount === 0) {
            throw { error: true, message: 'No pre tender details found with this reference number' }
        }

        const boqData = await prisma.boq.findFirst({
            where: { reference_no: reference_no },
            select: { status: true },
        })

        if (boqData?.status !== 70) {
            throw { error: true, message: 'BOQ is not valid to proceed' }
        }

        const result = await prisma.bid_details.create({
            data: {
                reference_no: reference_no,
                bid_type: bid_type,
                creationStatus: 1,
            },
        })

        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

type criteriaType = {
    heading: string
    description: string
}

type criteriaPayloadType = {
    reference_no: string
    criteria: criteriaType[]
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
            where: { reference_no: reference_no },
        })

        if (preTenderDetailsCount === 0) {
            throw { error: true, message: 'No pre tender details found with this reference number' }
        }

        const bidDetailsData = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                creationStatus: true,
            },
        })

        if (bidDetailsData?.creationStatus !== 1) {
            throw { error: true, message: 'Current creation status is not valid for this step ' }
        }

        const addedCriteria = await prisma.criteria.findMany({
            where: {
                reference_no: reference_no,
            },
        })

        const isAlreadyThere = addedCriteria.filter(item => item?.criteria_type === criteria_type)

        if (isAlreadyThere.length > 0) {
            throw { error: true, message: `Criteria type : ${criteria_type} is already added ` }
        }

        await prisma.$transaction(async tx => {
            await Promise.all(
                criteria.map(async item => {
                    await tx.criteria.create({
                        data: {
                            reference_no: reference_no,
                            heading: item?.heading,
                            description: item?.description,
                            criteria_type: criteria_type,
                        },
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
    const { reference_no, no_of_bidders }: { reference_no: string; no_of_bidders: number } = req.body
    try {
        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        if (!no_of_bidders) {
            throw { error: true, message: "Number of bidders is required as 'no_of_bidders'" }
        }

        const preTenderDetailsCount = await prisma.pre_tendering_details.count({
            where: { reference_no: reference_no },
        })

        if (preTenderDetailsCount === 0) {
            throw { error: true, message: 'No pre tender details found with this reference number' }
        }

        const bidDetailsData = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                creationStatus: true,
                bid_type: true,
            },
        })

        if (bidDetailsData?.creationStatus !== 1) {
            throw { error: true, message: 'Current creation status is not valid for this step ' }
        }

        const addedCriteria = await prisma.criteria.findMany({
            where: {
                reference_no: reference_no,
            },
        })

        if (bidDetailsData?.bid_type === 'fintech') {
            if (addedCriteria.length < 2) {
                throw { error: true, message: `All required criterias are not added yet` }
            }
        } else {
            if (addedCriteria.length < 1) {
                throw { error: true, message: `All required criterias are not added yet` }
            }
        }

        await prisma.$transaction(async tx => {
            await tx.bid_details.update({
                where: { reference_no: reference_no },
                data: {
                    no_of_bidders: no_of_bidders,
                    creationStatus: 2,
                },
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
    const { emd_doc, tech_doc, fin_doc } = (req.files as any) || {}
    try {
        // const formattedBidder: Omit<bidder_master, 'id' | 'emd_doc' | 'bidder_doc' | 'createdAt' | 'updatedAt'> = JSON.parse(bidder)
        const formattedBidder: any = JSON.parse(bidder)

        if (!formattedBidder) {
            throw { error: true, message: 'Bidder details are mandatory' }
        }

        if (!formattedBidder?.reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        const preTenderDetailsCount = await prisma.pre_tendering_details.count({
            where: { reference_no: formattedBidder?.reference_no },
        })

        if (preTenderDetailsCount === 0) {
            throw { error: true, message: 'No pre tender details found with this reference number' }
        }

        const preTenderDetails = await prisma.pre_tendering_details.findFirst({
            where: { reference_no: formattedBidder?.reference_no },
            select: {
                emd: true
            }
        })

        if (preTenderDetails?.emd && !emd_doc) {
            throw { error: true, message: "EMD document is required as 'emd_doc'" }
        }

        const bidDetailsData = await prisma.bid_details.findFirst({
            where: { reference_no: formattedBidder?.reference_no },
            select: {
                bid_type: true,
                creationStatus: true,
                no_of_bidders: true,
                _count: {
                    select: {
                        bidder_master: true,
                    },
                },
            },
        })

        if (bidDetailsData) {
            const bidderCount = bidDetailsData?._count?.bidder_master || 0
            const no_of_bidders = bidDetailsData?.no_of_bidders || 0

            if (bidderCount >= no_of_bidders) {
                throw { error: true, message: 'Requird bidders are already added' }
            }
        }

        if (bidDetailsData?.creationStatus !== 2) {
            throw { error: true, message: 'Current creation status is not valid for this step ' }
        }

        if (bidDetailsData?.bid_type === 'technical' && !tech_doc) {
            throw { error: true, message: 'Technical document is required' }
        }

        if (bidDetailsData?.bid_type === 'financial' && !fin_doc) {
            throw { error: true, message: 'Financial document is required' }
        }

        if (bidDetailsData?.bid_type === 'fintech' && !fin_doc && !tech_doc) {
            throw { error: true, message: 'Both financial and technical documents are required' }
        }

        const emd_doc_path = await imageUploaderV2(emd_doc)
        let tech_doc_path: string[] = []
        let fin_doc_path: string[] = []

        if (tech_doc) {
            tech_doc_path = await imageUploaderV2(tech_doc)
        }
        if (fin_doc) {
            fin_doc_path = await imageUploaderV2(fin_doc)
        }

        await prisma.$transaction(async tx => {
            const newBidder = await tx.bidder_master.create({
                data: {
                    reference_no: formattedBidder?.reference_no,
                    name: formattedBidder?.name,
                    gst_no: String(formattedBidder?.gst_no),
                    pan_no: String(formattedBidder?.pan_no),
                    address: formattedBidder?.address,
                    bank: formattedBidder?.bank,
                    account_no: String(formattedBidder?.account_no),
                    ifsc: formattedBidder?.ifsc,
                    emd: formattedBidder?.emd === 'yes' ? true : false,
                    emd_doc: emd_doc_path[0],
                    payment_mode: formattedBidder?.payment_mode as payment_mode_enum,
                    offline_mode: formattedBidder?.offline_mode as offline_mode_enum,
                    dd_no: formattedBidder?.dd_no && null,
                    transaction_no: String(formattedBidder?.transaction_no),
                    bidding_amount: Number(formattedBidder?.bidding_amount),
                },
            })

            if (tech_doc) {
                await tx.bidder_doc.create({
                    data: {
                        bidder_id: newBidder?.id,
                        criteria_type: 'technical',
                        doc_path: tech_doc_path[0],
                    },
                })
            }

            if (fin_doc) {
                await tx.bidder_doc.create({
                    data: {
                        bidder_id: newBidder?.id,
                        criteria_type: 'financial',
                        doc_path: fin_doc_path[0],
                    },
                })
            }
        })

        return 'Bidder details added'
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

export const submitBidderDetailsDal = async (req: Request) => {
    const { reference_no }: { reference_no: string } = req.body
    try {
        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        const preTenderDetailsCount = await prisma.pre_tendering_details.count({
            where: { reference_no: reference_no },
        })

        if (preTenderDetailsCount === 0) {
            throw { error: true, message: 'No pre tender details found with this reference number' }
        }

        const bidDetailsData = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                creationStatus: true,
                no_of_bidders: true,
                _count: {
                    select: {
                        bidder_master: true,
                    },
                },
            },
        })

        if (bidDetailsData) {
            const bidderCount = bidDetailsData?._count?.bidder_master || 0
            const no_of_bidders = bidDetailsData?.no_of_bidders || 0

            if (bidderCount !== no_of_bidders) {
                throw { error: true, message: "Total number of added bidders doesn't match the total declared number of bidders" }
            }
        }

        if (bidDetailsData?.creationStatus !== 2) {
            throw { error: true, message: 'Current creation status is not valid for this step ' }
        }

        await prisma.$transaction(async tx => {
            await tx.bid_details.update({
                where: { reference_no: reference_no },
                data: {
                    creationStatus: 3,
                },
            })
        })

        return 'Bidder details submitted'
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

type comparisonCriteriaType = {
    criteria_id: string
    value: number
}

type comparisonDataType = {
    bidder_id: string
    comparison_criteria: comparisonCriteriaType[]
}

type comparisonPayloadType = {
    reference_no: string
    comparison_type: comparison_type_enum
    criteria_type: criteria_type_enum
    comparison_data: comparisonDataType[]
}

export const comparisonDal = async (req: Request) => {
    const { reference_no, comparison_type, comparison_data, criteria_type }: comparisonPayloadType = req.body
    try {
        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        if (!comparison_type) {
            throw { error: true, message: "Comparison type is required as 'comparison_type'" }
        }

        if (comparison_data.length === 0) {
            throw { error: true, message: "Comparison data is required as 'comparison_data[]'" }
        }

        const bidDetails = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                bid_type: true,
                creationStatus: true,
            },
        })

        const comparedData = await prisma.comparison.count({
            where: {
                reference_no: reference_no,
                comparison_criteria: {
                    some: {
                        criteria: {
                            criteria_type: 'technical',
                        },
                    },
                },
            },
        })

        if (bidDetails?.creationStatus !== 3 && bidDetails?.creationStatus !== 41 && bidDetails?.creationStatus !== 42) {
            throw { error: true, message: 'Current creation status is not valid for this step ' }
        }

        if (bidDetails?.bid_type === 'fintech' && comparedData === 0 && criteria_type === 'financial') {
            throw { error: true, message: 'Technical comparison is not completed yet' }
        }

        await prisma.$transaction(async tx => {
            await Promise.all(
                comparison_data.map(async item => {

                    const existingComparisonCount = await prisma.comparison.count({
                        where: {
                            reference_no: reference_no,
                            bidder_id: item?.bidder_id
                        }
                    })

                    if (existingComparisonCount === 0) {
                        await tx.comparison.create({
                            data: {
                                reference_no: reference_no,
                                bidder_id: item?.bidder_id,
                            },
                        })
                    }
                    await Promise.all(
                        item?.comparison_criteria.map(async criteriaData => {
                            await tx.comparison_criteria.create({
                                data: {
                                    bidder_id: item?.bidder_id,
                                    criteria_id: criteriaData?.criteria_id,
                                    value: Number(criteriaData?.value),
                                    comparison_type: comparison_type,
                                },
                            })
                        })
                    )
                })
            )
        })

        return 'Comparison details details submitted'
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

export const comparisonResultDal = async (req: Request) => {
    const { reference_no } = req.params
    try {
        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        const bid_type = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                bid_type: true
            }
        })


        const techComparison = await prisma.comparison.count({
            where: {
                reference_no: reference_no,
                comparison_criteria: {
                    some: {
                        criteria: {
                            criteria_type: 'technical'
                        }
                    }
                }
            }
        })

        const finComparison = await prisma.comparison.count({
            where: {
                reference_no: reference_no,
                comparison_criteria: {
                    some: {
                        criteria: {
                            criteria_type: 'financial'
                        }
                    }
                }
            }
        })

        const comparisonTypeFilter = () => {
            if (bid_type?.bid_type === 'financial') {
                return 'financial'
            } else if (bid_type?.bid_type === 'technical') {
                return 'technical'
            } else if (bid_type?.bid_type === 'fintech' && techComparison === 0 && finComparison === 0) {
                return 'technical'
            } else {
                return "financial"
            }
        }

        const bidDetails: any = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                bid_type: true,
                comparison: {
                    where: {
                        bidder_master: {
                            has_lost: false,
                        }
                    },
                    select: {
                        bidder_master: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        comparison_criteria: {
                            where: {
                                criteria: {
                                    criteria_type: comparisonTypeFilter()
                                }
                            },
                            select: {
                                criteria: {
                                    select: {
                                        id: true,
                                        heading: true,
                                        description: true,
                                    },
                                },
                                comparison_type: true,
                                value: true,
                            },
                        },
                    },
                },
            },
        })

        if (!bidDetails) {
            throw { error: true, message: 'No bid details with provided reference number' }
        }

        bidDetails.comparison.sort((a: any, b: any) => {
            const sumA = a.comparison_criteria.reduce((sum: number, item: any) => sum + item.value, 0)
            const sumB = b.comparison_criteria.reduce((sum: number, item: any) => sum + item.value, 0)
            return sumB - sumA // Sort in descending order
        })

        const scores = bidDetails.comparison.reduce((acc: any, comparison: any) => {
            const sum = comparison.comparison_criteria.reduce((sumAcc: number, criteria: any) => sumAcc + Number(criteria.value), 0)
            acc[comparison?.bidder_master?.id] = (acc[comparison?.bidder_master?.id] || 0) + sum
            return acc
        }, {})

        //assign total score to the response
        bidDetails?.comparison.map((item: any) => {
            item.total_score = scores[item?.bidder_master?.id]
        })


        if (bidDetails) {
            bidDetails.techComparison = techComparison === 0 ? false : true
            bidDetails.finComparison = finComparison === 0 ? false : true
        }

        return { bidDetails }
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

export const selectWinnerDal = async (req: Request) => {
    const { reference_no, winners }: { reference_no: string, winners: string[] } = req.body
    try {

        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        if (winners.length === 0) {
            throw { error: true, message: "Atleast one winner is required" }
        }

        const participants = await prisma.comparison.count({
            where: {
                bidder_id: {
                    in: winners
                },
                bidder_master: {
                    has_lost: false
                }
            }
        })

        if (participants !== winners.length) {
            throw { error: true, message: "One or more bidder(s) from the provided winner's list has not participated in the bidding yet" }
        }

        const bidDetailsdata = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                bid_type: true
            }
        })

        const techComparison = await prisma.comparison.count({
            where: {
                reference_no: reference_no,
                comparison_criteria: {
                    some: {
                        criteria: {
                            criteria_type: 'technical'
                        }
                    }
                }
            }
        })

        const finComparison = await prisma.comparison.count({
            where: {
                reference_no: reference_no,
                comparison_criteria: {
                    some: {
                        criteria: {
                            criteria_type: 'financial'
                        }
                    }
                }
            }
        })



        await prisma.$transaction(async (tx) => {
            await tx.bidder_master.updateMany({
                where: {
                    reference_no: reference_no,
                    has_lost: false,
                    id: {
                        notIn: winners
                    }
                },
                data: {
                    has_lost: true
                }
            })
            if ((bidDetailsdata?.bid_type === 'technical' && techComparison > 0) || (bidDetailsdata?.bid_type === 'fintech' && techComparison > 0)) {
                await tx.bid_details.update({
                    where: { reference_no: reference_no },
                    data: {
                        creationStatus: 41
                    }
                })
            }

            if ((bidDetailsdata?.bid_type === 'financial' && finComparison > 0) || (bidDetailsdata?.bid_type === 'fintech' && finComparison > 0)) {
                await tx.bid_details.update({
                    where: { reference_no: reference_no },
                    data: {
                        creationStatus: 42
                    }
                })
            }

        })


        return 'Winner(s) selected'

    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

export const finalizeComparisonDal = async (req: Request) => {
    const { reference_no }: { reference_no: string } = req.body
    try {

        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        const bidDetailsData = await prisma.bid_details.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                reference_no: true,
                bid_type: true,
                boq: {
                    select: {
                        procurement_no: true,
                        pre_tendering_details: {
                            select: {
                                tendering_type: true
                            }
                        }
                    }
                }
            }
        })

        if (!bidDetailsData) {
            throw { error: true, message: `No bid details for reference number : ${reference_no}` }
        }

        const techComparisonCount = await prisma.comparison.count({
            where: {
                reference_no: reference_no,
                comparison_criteria: {
                    some: {
                        criteria: {
                            criteria_type: 'technical'
                        }
                    }
                }
            }
        })

        const finComparisonCount = await prisma.comparison.count({
            where: {
                reference_no: reference_no,
                comparison_criteria: {
                    some: {
                        criteria: {
                            criteria_type: 'financial'
                        }
                    }
                }
            }
        })

        if (bidDetailsData?.bid_type === 'technical' && techComparisonCount === 0) {
            throw { error: true, message: `Technical comparison is required` }
        }

        if (bidDetailsData?.bid_type === 'financial' && finComparisonCount === 0) {
            throw { error: true, message: `Financial comparison is required` }
        }

        if (bidDetailsData?.bid_type === 'fintech' && (finComparisonCount === 0 || techComparisonCount === 0)) {
            throw { error: true, message: `Both financial and technical comparisons are required` }
        }

        const bidderMasterDetails = await prisma.bidder_master.findMany({
            where: {
                reference_no: reference_no,
                has_lost: false
            },
            select: {
                name: true,
                gst_no: true,
                pan_no: true,
                address: true,
                bank: true,
                account_no: true,
                ifsc: true,
            }
        })

        await prisma.$transaction(async (tx) => {
            await Promise.all(
                bidderMasterDetails.map(async bidder => {
                    await tx.supplier_master.create({
                        data: {
                            reference_no: reference_no,
                            procurement_no: bidDetailsData?.boq?.procurement_no as string,
                            name: bidder?.name,
                            gst_no: bidder?.gst_no,
                            pan_no: bidder?.pan_no,
                            address: bidder?.address,
                            bank_name: bidder?.bank,
                            account_no: bidder?.account_no,
                            ifsc: bidder?.ifsc
                        }
                    })
                })
            )

            await tx.bid_details.update({
                where: {
                    reference_no: reference_no
                },
                data: {
                    creationStatus: 4
                }
            })
            if (bidDetailsData?.boq?.pre_tendering_details?.tendering_type !== 'rate_contract') {
                await tx.da_post_procurement_inbox.create({
                    data: {
                        procurement_no: bidDetailsData?.boq?.procurement_no as string
                    }
                })
            }

            await tx.notification.create({
                data: {
                    role_id: Number(process.env.ROLE_IA),
                    title: 'Bidding completed',
                    destination: 23,
                    description: `Bidding completed for Procurement Number : ${bidDetailsData?.boq?.procurement_no}`,
                },
            })

        })

        return 'Comparison finalized'

    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

type setUnitPricePayloadType = {
    reference_no: string,
    procurement_no: string,
    items: {
        items: string
        suppliers: {
            id: string,
            unit_price: number
        }[]
    }[]
}


const calculateEndDate = (start_date: Date, tenure: number): Date => {

    // Calculate the total number of months to add
    const totalMonths = tenure * 12;

    // Calculate the whole number of years and remaining months
    const yearsToAdd = Math.floor(totalMonths / 12);
    const monthsToAdd = totalMonths % 12;

    // Create a new date based on the start_date
    const end_date = new Date(start_date);

    // Add the years and months
    end_date.setFullYear(end_date.getFullYear() + yearsToAdd);
    end_date.setMonth(end_date.getMonth() + monthsToAdd);

    // console.log('Start Date:', start_date);
    // console.log('End Date:', end_date);
    return end_date
}

export const setUnitPriceDal = async (req: Request) => {
    const { reference_no, procurement_no, items }: setUnitPricePayloadType = req.body
    try {

        if (!procurement_no) {
            throw { error: true, message: "Procurement number is required as 'reference_no'" }
        }

        if (items?.length === 0) {
            throw { error: true, message: "No item has provided" }
        }

        const currentDate = new Date();

        const preTenderDetails = await prisma.pre_tendering_details.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                tenure: true
            }
        })

        await prisma.$transaction(async (tx) => {
            await Promise.all(
                items.map(async item => {
                    const procStock = await prisma.procurement_stocks.findFirst({
                        where: {
                            id: item?.items
                        },
                        select: {
                            category_masterId: true,
                            subCategory_masterId: true,
                            unit_masterId: true,
                            description: true
                        }
                    })
                    const rateContract = await tx.rate_contract.create({
                        data: {
                            category: { connect: { id: procStock?.category_masterId as string } },
                            subcategory: { connect: { id: procStock?.subCategory_masterId as string } },
                            unit: { connect: { id: procStock?.unit_masterId as string } },
                            description: procStock?.description as string,
                            start_date: currentDate,
                            end_date: calculateEndDate(currentDate, Number(preTenderDetails?.tenure)),
                        }
                    })
                    await Promise.all(
                        item?.suppliers.map(async supplier => {
                            await tx.rate_contract_supplier.create({
                                data: {
                                    rate_contract: { connect: { id: rateContract?.id as string } },
                                    unit_price: Number(supplier?.unit_price),
                                    supplier_master: { connect: { id: supplier?.id as string } },
                                }
                            })
                        })
                    )
                })
            )

            await tx.bid_details.update({
                where: {
                    reference_no: reference_no
                },
                data: {
                    creationStatus: 5
                }
            })

            await tx.da_post_procurement_inbox.create({
                data: {
                    procurement_no: procurement_no as string
                }
            })

            await tx.notification.create({
                data: {
                    role_id: Number(process.env.ROLE_IA),
                    title: 'Bidding completed',
                    destination: 23,
                    description: `Bidding completed for Procurement Number : ${procurement_no}`,
                },
            })

        })

        return 'Unit price added'

    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}
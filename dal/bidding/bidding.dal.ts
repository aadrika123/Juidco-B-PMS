import { Request } from "express";
import getErrorMessage from "../../lib/getErrorMessage";
import {
    PrismaClient,
} from "@prisma/client";


const prisma = new PrismaClient()


export const getBidDetailsDal = async (req: Request) => {
    const { reference_no } = req.params
    try {

        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        const result: any = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                reference_no: true,
                bid_type: true,
                no_of_bidders: true,
                status: true,
                creationStatus: true,
                boq: {
                    select: {
                        pre_tendering_details: {
                            select: {
                                tendering_type: true
                            }
                        }
                    }
                },
                bidder_master: {
                    where: { has_lost: false },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        name: true,
                        gst_no: true,
                        pan_no: true,
                        address: true,
                        bank: true,
                        account_no: true,
                        ifsc: true,
                        emd: true,
                        emd_doc: true,
                        payment_mode: true,
                        offline_mode: true,
                        dd_no: true,
                        transaction_no: true,
                        bidder_doc: true,
                        bidding_amount: true,
                    }
                },
                comparison: {
                    select: {
                        id: true,
                        bidder_master: {
                            select: {
                                id: true,
                                name: true,
                                gst_no: true,
                                pan_no: true,
                                address: true,
                                bank: true,
                                account_no: true,
                                ifsc: true,
                                emd: true,
                                emd_doc: true,
                                payment_mode: true,
                                offline_mode: true,
                                dd_no: true,
                                transaction_no: true,
                                bidder_doc: true,
                                bidding_amount: true,
                            }
                        },
                        comparison_criteria: {
                            select: {
                                criteria: {
                                    select: {
                                        id: true,
                                        heading: true
                                    }
                                },
                                value: true
                            }
                        }
                    }
                }
            }
        })


        const techCriteria = await prisma.criteria.findMany({
            where: { reference_no: reference_no, criteria_type: 'technical' },
            select: {
                id: true,
                criteria_type: true,
                heading: true,
                description: true
            }
        })

        const finCriteria = await prisma.criteria.findMany({
            where: { reference_no: reference_no, criteria_type: 'financial' },
            select: {
                id: true,
                criteria_type: true,
                heading: true,
                description: true
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

        if (result) {
            result.techCriteria = techCriteria
            result.finCriteria = finCriteria
            result.techComparison = techComparison === 0 ? false : true
            result.finComparison = finComparison === 0 ? false : true
        }

        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}
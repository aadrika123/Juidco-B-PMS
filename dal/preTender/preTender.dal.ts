import { Request } from "express";
import getErrorMessage from "../../lib/getErrorMessage";
import {
    PrismaClient,
} from "@prisma/client";
import axios from "axios";


const prisma = new PrismaClient()


const checkExistence = async (reference_no: string) => {
    try {

        const count = await prisma.tendering_form.count({
            where: {
                reference_no: reference_no
            }
        })

        return count !== 0 ? true : false
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const getPreTenderDal = async (req: Request) => {
    const { reference_no } = req.params
    try {

        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        if (!await checkExistence(reference_no)) {
            throw { error: true, message: "Invalid pre-tender form" }
        }

        const result: any = await prisma.tendering_form.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                id: true,
                reference_no: true,
                status: true,
                isEdited: true,
                isPartial: true,
                basic_details: {
                    select: {
                        allow_offline_submission: true,
                        allow_resubmission: true,
                        allow_withdrawl: true,
                        payment_mode: true,
                        onlinePyment_mode: true,
                        offline_banks: true,
                        contract_form: true,
                        tender_category: true,
                        tender_type: true
                    }
                },
                cover_details: {
                    select: {
                        noOfCovers: true,
                        content: true,
                        cover_details_docs: {
                            select: {
                                type: true,
                                docPath: true
                            }
                        }
                    }
                },
                work_details: {
                    select: {
                        workDiscription: true,
                        pre_qualification_details: true,
                        product_category: true,
                        productSubCategory: true,
                        contract_type: true,
                        tender_values: true,
                        bid_validity: true,
                        completionPeriod: true,
                        location: true,
                        pinCode: true,
                        pre_bid: true,
                        preBidMeeting: true,
                        preBidMeetingAdd: true,
                        bidOpeningPlace: true,
                        tenderer_class: true,
                        invstOffName: true,
                        invstOffAdd: true,
                        invstOffEmail_Ph: true,
                    }
                },
                fee_details: {
                    select: {
                        tenderFee: true,
                        processingFee: true,
                        tenderFeePayableTo: true,
                        tenderFeePayableAt: true,
                        surcharges: true,
                        otherCharges: true,
                        emd_exemption: true,
                        emd_fee: true,
                        emdPercentage: true,
                        emdAmount: true,
                        emdFeePayableTo: true,
                        emdFeePayableAt: true
                    }
                },
                critical_dates: {
                    select: {
                        publishingDate: true,
                        bidOpeningDate: true,
                        docSaleStartDate: true,
                        docSaleEndDate: true,
                        seekClariStrtDate: true,
                        seekClariEndDate: true,
                        bidSubStrtDate: true,
                        bidSubEndDate: true,
                        preBidMettingDate: true
                    }
                },
                bid_openers: {
                    select: {
                        id: true,
                        reference_no: true,
                        b01NameDesig: true,
                        b01Email: true,
                        b02NameDesig: true,
                        b02Email: true,
                        b03NameDesig: true,
                        b03Email: true,
                        bid_openers_docs: {
                            select: {
                                type: true,
                                ReferenceNo: true,
                                uniqueId: true,
                                nameDesig: true,
                                description: true,
                                docSize: true,
                            }
                        }
                    }
                }
            }
        })

        //Append document in basic details
        if (result?.basic_details) {
            const basicDetailsDoc = await prisma.tendering_form_docs.findMany({
                where: {
                    reference_no: reference_no,
                    form: 'basic_details'
                },
                select: {
                    ReferenceNo: true
                }
            })

            await Promise.all(
                basicDetailsDoc.map(async (item: any) => {
                    const headers = {
                        "token": "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0"
                    }
                    await axios.post(process.env.DMS_GET || '', { "referenceNo": item?.ReferenceNo }, { headers })
                        .then((response) => {
                            item.docUrl = response?.data?.data?.fullPath
                        }).catch((err) => {
                            throw err
                        })
                })
            )

            result.basic_details.doc = basicDetailsDoc
        }

        //Append document in bid openers
        if (result?.bid_openers) {
            await Promise.all(
                result?.bid_openers?.bid_openers_docs.map(async (item: any) => {
                    const headers = {
                        "token": "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0"
                    }
                    await axios.post(process.env.DMS_GET || '', { "referenceNo": item?.ReferenceNo }, { headers })
                        .then((response) => {
                            item.docUrl = response?.data?.data?.fullPath
                        }).catch((err) => {
                            throw err
                        })
                }) as any
            )
        }


        return result ? result : null
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}
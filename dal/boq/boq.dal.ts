import { Request } from "express";
import getErrorMessage from "../../lib/getErrorMessage";
import {
    PrismaClient,
} from "@prisma/client";
import { boqData } from "../../type/accountant.type";
import { uploadedDoc } from "../../type/common.type";
import { imageUploader } from "../../lib/imageUploader";
import axios from "axios";


const prisma = new PrismaClient()


export const getBoqByRefNoDal = async (req: Request) => {
    const { reference_no } = req.params
    try {
        const result: any = await prisma.boq.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                reference_no: true,
                gst: true,
                estimated_cost: true,
                hsn_code: true,
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
                },
                boq_doc: {
                    select: {
                        ReferenceNo: true
                    }
                }
            },
        })

        await Promise.all(
            result?.boq_doc.map(async (doc: any) => {
                const headers = {
                    "token": "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0"
                }
                await axios.post(process.env.DMS_GET || '', { "referenceNo": doc?.ReferenceNo }, { headers })
                    .then((response) => {
                        // console.log(response?.data?.data, 'res')
                        doc.imageUrl = response?.data?.data?.fullPath
                    }).catch((err) => {
                        // console.log(err?.data?.data, 'err')
                        // toReturn.push(err?.data?.data)
                        throw err
                    })
            })

        )

        const updatedProcurements = result.procurements.map((proc: any) => {
            const temp = { ...proc.procurement };
            // Delete the procurement property from proc
            const { procurement, ...rest } = proc;
            return { ...rest, ...temp };
        });

        // Assign the updated array back to item.boq.procurements
        result.procurements = updatedProcurements;

        return [result]
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const editBoqDal = async (req: Request) => {
    const { boqData } = req.body
    try {
        const formattedBoqData: boqData = JSON.parse(boqData)
        const img = req.files as Express.Multer.File[]
        let arrayToSend: any[] = []
        let docToSend: any[] = []


        await Promise.all(
            formattedBoqData?.procurement.map(async (item) => {
                const preparedData = {
                    // reference_no: formattedBoqData?.reference_no,
                    procurement_no: item?.procurement_no,
                    description: item?.description,
                    quantity: item?.quantity,
                    unit: item?.unit,
                    rate: item?.rate,
                    amount: item?.amount,
                    remark: item?.remark,
                }
                arrayToSend.push(preparedData)
            })
        )

        const preparedBoq = {
            // reference_no: formattedBoqData?.reference_no,
            gst: formattedBoqData?.gst,
            estimated_cost: formattedBoqData?.estimated_cost,
            remark: formattedBoqData?.remark,
            isEdited: true,
            hsn_code: formattedBoqData?.hsn_code
        }

        if (img) {
            const uploaded: uploadedDoc[] = await imageUploader(img)   //It will return reference number and unique id as an object after uploading.

            uploaded.map((doc: uploadedDoc) => {
                const preparedBoqDoc = {
                    reference_no: formattedBoqData?.reference_no,
                    ReferenceNo: doc?.ReferenceNo,
                    uniqueId: doc?.uniqueId,
                    remark: formattedBoqData?.remark
                }
                docToSend.push(preparedBoqDoc)
            })

        }

        //start transaction
        await prisma.$transaction(async (tx) => {

            await tx.boq.update({
                where: {
                    reference_no: formattedBoqData?.reference_no
                },
                data: preparedBoq
            })

            // await tx.boq_procurement.updateMany({
            //     where: {
            //         reference_no: formattedBoqData?.reference_no
            //     },
            //     data: arrayToSend
            // })

            await Promise.all(
                formattedBoqData?.procurement.map(async (item) => {
                    const preparedData = {
                        // reference_no: formattedBoqData?.reference_no,
                        procurement_no: item?.procurement_no,
                        description: item?.description,
                        quantity: item?.quantity,
                        unit: item?.unit,
                        rate: item?.rate,
                        amount: item?.amount,
                        remark: item?.remark,
                    }
                    await tx.boq_procurement.update({
                        where: {
                            procurement_no: item?.procurement_no
                        },
                        data: preparedData
                    })
                })
            )

            if (img) {
                await tx.boq_doc.deleteMany({
                    where: {
                        reference_no: formattedBoqData?.reference_no
                    }
                })
                await tx.boq_doc.createMany({
                    data: docToSend
                })
            }

        })

        return "BOQ Edited"

    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}
import { Request } from "express";
import getErrorMessage from "../../lib/getErrorMessage";
import {
    PrismaClient,
} from "@prisma/client";


const prisma = new PrismaClient()


export const getBoqByRefNoDal = async (req: Request) => {
    const { reference_no }: { reference_no: string } = req.body
    try {
        const result: any = await prisma.boq.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                reference_no: true,
                gst: true,
                estimated_cost: true,
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
                }
            },
        })

        const updatedProcurements = result.procurements.map((proc: any) => {
            const temp = { ...proc.procurement };
            // Delete the procurement property from proc
            const { procurement, ...rest } = proc;
            return { ...rest, ...temp };
        });

        // Assign the updated array back to item.boq.procurements
        result.procurements = updatedProcurements;

        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

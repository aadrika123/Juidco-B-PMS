import { Request } from 'express';
import { PrismaClient } from "@prisma/client";
import csvGenerator from '../../lib/csvGenerator'

const prisma = new PrismaClient()

export const exportCsvDal = async (req: Request) => {
    let jsonData: any
    const whereClause: any = {};
    const search: string = req?.body?.search ? String(req?.body?.search) : ''
    whereClause.OR = [
        {
            order_no: {
                contains: search,
                mode: 'insensitive'
            }
        },
        {
            other_description: {
                contains: search,
                mode: 'insensitive'
            }
        }
    ];

    const condition: any = {
        orderBy: {
            createdAt: 'desc'
        },
        where: whereClause,
        select: {
            order_no: true,
            category: {
                select: {
                    id: true,
                    name: true
                }
            },
            subcategory: {
                select: {
                    id: true,
                    name: true
                }
            },
            brand: {
                select: {
                    id: true,
                    name: true
                }
            },
            processor: {
                select: {
                    id: true,
                    name: true
                }
            },
            ram: {
                select: {
                    id: true,
                    capacity: true
                }
            },
            os: {
                select: {
                    id: true,
                    name: true
                }
            },
            rom: {
                select: {
                    id: true,
                    capacity: true,
                    type: true
                }
            },
            graphics: {
                select: {
                    id: true,
                    name: true,
                    vram: true
                }
            },
            other_description: true,
            rate: true,
            quantity: true,
            total_rate: true,
            status: {
                select: {
                    id: true,
                    status: true
                }
            },
            remark: true,
            isEdited: true,
            colour: true,
            material: true,
            dimension: true,
            room_type: true,
            included_components: true,
            size: true,
            recomended_uses: true,
            bristle: true,
            weight: true,
            number_of_items: true
        }
    }

    switch (req?.body?.table) {
        case "SRIN": {
            jsonData = await prisma.sr_pre_procurement_inbox.findMany(condition)
        }
        case "SROUT": {
            jsonData = await prisma.sr_pre_procurement_outbox.findMany(condition)
        }
        case "DAIN": {
            jsonData = await prisma.da_pre_procurement_inbox.findMany(condition)
        }
        case "DAOUT": {
            jsonData = await prisma.da_pre_procurement_outbox.findMany(condition)
        }
    }

    const orderStatus = (status: number) => {
        switch (status) {
            case -2:
                return "Rejected"
            case -1:
                return "Reversed from DA"
            case 0:
                return "Pending"
            case 1:
                return "Forwarded to DA"
            case 2:
                return "Released for Tender"
            case 3:
                return "Stock Received"
            case 4:
                return "Stock Verified"
        }
    }


    const dataToExport = jsonData.map((item: any) => {
        return {
            "Order Number": item?.order_no,
            "Category": item?.category?.name,
            "Sub Category": item?.subcategory?.name,
            "Brand": item?.order_no,
            ...(item?.processor !== null && { "Processor": item?.processor?.name }),
            ...(item?.brand !== null && { "Brand": item?.brand?.name }),
            ...(item?.ram !== null && { "Ram": item?.ram?.capacity }),
            ...(item?.os !== null && { "OS": item?.os?.name }),
            ...(item?.rom !== null && { "ROM": item?.rom?.capacity }),
            ...(item?.graphics !== null && { "Graphics": item?.graphics?.name }),
            ...(item?.colour !== null && { "Colour": item?.colour }),
            ...(item?.material !== null && { "Material": item?.material }),
            ...(item?.dimension !== null && { "Dimension": item?.dimension }),
            ...(item?.room_type !== null && { "Room Type": item?.room_type }),
            ...(item?.included_components !== null && { "Included Components": item?.included_components }),
            ...(item?.size !== null && { "Size": item?.size }),
            ...(item?.recomended_uses !== null && { "Recomended Uses": item?.recomended_uses }),
            ...(item?.bristle !== null && { "Bristle": item?.bristle }),
            ...(item?.weight !== null && { "Weight": item?.weight }),
            ...(item?.number_of_items !== null && { "Number of Items": item?.number_of_items }),
            "Rate": item?.rate,
            "Quantity": item?.quantity,
            "Total Rate": item?.total_rate,
            "Status": orderStatus(item?.status?.status),
            "Remark": item?.remark,
            "Edited": item?.isEdited ? "Yes" : "No"
        }
    })


    return csvGenerator(dataToExport)
}

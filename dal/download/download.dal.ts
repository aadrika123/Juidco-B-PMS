import { Request } from 'express';
import { PrismaClient } from "@prisma/client";
import csvGenerator from '../../lib/csvGenerator'

const prisma = new PrismaClient()

export const exportCsvDal = async (req: Request) => {
    let jsonData: any
    const whereClause: any = {};
    const search: string = req?.body?.search ? String(req?.body?.search) : ''
    const category: any[] = Array.isArray(req?.body?.category) ? req?.body?.category : [req?.body?.category]
    const subcategory: any[] = Array.isArray(req?.body?.scategory) ? req?.body?.scategory : [req?.body?.scategory]
    const status: any[] = Array.isArray(req?.query?.status) ? req?.query?.status : [req?.query?.status]

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
        },
        {
            brand: {
                contains: search,
                mode: 'insensitive'
            }
        }
    ];

    if (category[0]) {
        whereClause.category_masterId = {
            in: category
        }
    }
    if (subcategory[0]) {
        whereClause.subcategory_masterId = {
            in: subcategory
        }
    }
    if (status[0]) {
        whereClause.status = {
            status: {
                in: status.map(Number)
            }
        }
    }

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
            brand: true,
            processor: true,
            ram: true,
            os: true,
            rom: true,
            graphics: true,
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
            break
        }
        case "SROUT": {
            jsonData = await prisma.sr_pre_procurement_outbox.findMany(condition)
            break
        }
        case "DAIN": {
            jsonData = await prisma.da_pre_procurement_inbox.findMany(condition)
            break
        }
        case "DAOUT": {
            jsonData = await prisma.da_pre_procurement_outbox.findMany(condition)
            break
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

    if (jsonData) {
        const dataToExport = jsonData.map((item: any) => {
            return {
                "Order Number": item?.order_no,
                "Category": item?.category?.name,
                "Sub Category": item?.subcategory?.name,
                ...(item?.processor !== null && { "Processor": item?.processor }),
                ...(item?.brand !== null && { "Brand": item?.brand }),
                ...(item?.ram !== null && { "Ram": item?.ram }),
                ...(item?.os !== null && { "OS": item?.os }),
                ...(item?.rom !== null && { "ROM": item?.rom }),
                ...(item?.graphics !== null && { "Graphics": item?.graphics }),
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
                "Other Description": item?.other_description,
                "Edited": item?.isEdited ? "Yes" : "No"
            }
        })
        return csvGenerator(dataToExport)
    }
    return { error: true, message: "Error while creating CSV" }
}

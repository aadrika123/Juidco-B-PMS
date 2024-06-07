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
            brand_masterId: {
                in: brand
            }
        }
    }

    const condition: any = {
        orderBy: {
            updatedAt: 'desc'
        },
        where: whereClause,
        select: {
            id: true,
            procurement_no: true,
            procurement: {
                select: {
                    procurement_no: true,
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
                    quantity: true,
                    rate: true,
                    total_rate: true,
                    isEdited: true,
                    remark: true,
                    status: {
                        select: {
                            status: true
                        }
                    }
                }
            }
        }
    }

    switch (req?.body?.table) {
        //pre-procurement
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
        //post-procurement
        case "POSTSRIN": {
            jsonData = await prisma.sr_post_procurement_inbox.findMany(condition)
            break
        }
        case "POSTDAIN": {
            jsonData = await prisma.da_post_procurement_inbox.findMany(condition)
            break
        }
        case "POSTDAOUT": {
            jsonData = await prisma.da_post_procurement_outbox.findMany(condition)
            break
        }
        //received inventory
        case "RECSRIN": {
            jsonData = await prisma.sr_received_inventory_inbox.findMany(condition)
            break
        }
        case "RECSROUT": {
            jsonData = await prisma.sr_received_inventory_outbox.findMany(condition)
            break
        }
        case "RECDAIN": {
            jsonData = await prisma.da_received_inventory_inbox.findMany(condition)
            break
        }
        case "RECDAOUT": {
            jsonData = await prisma.da_received_inventory_outbox.findMany(condition)
            break
        }
    }

    let resultToSend: any[] = []

    jsonData.map(async (item: any) => {
        const temp = { ...item?.procurement }
        delete item.procurement
        resultToSend.push({ ...item, ...temp })
    })

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
        const dataToExport = resultToSend.map((item: any) => {
            return {
                "Procurement Number": item?.procurement_no,
                "Category": item?.category?.name,
                "Sub Category": item?.subcategory?.name,
                "Brand": item?.brand?.name,
                "Rate": item?.rate,
                "Quantity": item?.quantity,
                "Total Rate": item?.total_rate,
                "Status": orderStatus(item?.status?.status),
                "Remark": item?.remark,
                "Description": item?.description,
                "Edited": item?.isEdited ? "Yes" : "No"
            }
        })
        return csvGenerator(dataToExport)
    }
    return { error: true, message: "Error while creating CSV" }
}

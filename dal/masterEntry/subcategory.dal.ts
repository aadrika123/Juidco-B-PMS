import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import { pagination } from '../../type/common.type'

const prisma = new PrismaClient()

export const createSubcategoryDal = async (req: Request) => {
    const { name, category_masterId } = req.body

    const data: any = {
        name: name,
        category_masterId: category_masterId,
    }

    try {
        let result
        await prisma.$transaction(async tx => {
            result = await tx.subcategory_master.create({
                data: data,
            })
            await tx.$queryRawUnsafe(`
				create table product.product_${name.toLowerCase().replace(/\s/g, '')} (
					id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
					subcategory_masterId varchar(255) DEFAULT '${result?.id}',
					inventory_id varchar(255),
					procurement_no varchar(255),
                    brand varchar(255),
					serial_no varchar(255) UNIQUE,
					quantity FLOAT DEFAULT 1,
					is_added BOOLEAN DEFAULT FALSE, 
					is_available BOOLEAN DEFAULT FALSE,
					is_dead BOOLEAN DEFAULT FALSE, 
					createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
      				updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now()
				)
			`)
        })
        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: err?.message }
    }
}

export const getSubcategoryDal = async (req: Request) => {
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
    const status: boolean | undefined = req?.query?.status === undefined ? undefined : req?.query?.status === 'true' ? true : false
    //creating search options for the query
    if (search) {
        whereClause.OR = [
            {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
        ]
    }

    //creating filter options for the query
    if (category[0] || status !== undefined) {
        whereClause.AND = [
            ...(category[0]
                ? [
                    {
                        category_masterId: {
                            in: category,
                        },
                    },
                ]
                : []),
            ...(status !== undefined
                ? [
                    {
                        status: status,
                    },
                ]
                : []),
        ]
    }
    try {
        count = await prisma.subcategory_master.count({
            where: whereClause,
        })
        const result = await prisma.subcategory_master.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
            where: whereClause,
            ...(page && { skip: startIndex }),
            ...(take && { take: take }),
            include: {
                category: true,
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
        return { error: true, message: err?.message }
    }
}

export const getSubcategoryByCategoryIdDal = async (req: Request) => {
    const { categoryId } = req.params
    try {
        const result = await prisma.subcategory_master.findMany({
            where: {
                category_masterId: categoryId,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        })
        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: err?.message }
    }
}

export const createSubcategoryNoReqDal = async (name: string, category_masterId: string) => {
    // const { name, category_masterId } = req.body

    const data: any = {
        name: name,
        category_masterId: category_masterId,
    }

    try {
        const result = await prisma.subcategory_master.create({
            data: data,
        })
        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: err?.message }
    }
}

export const getSubcategoryByCategoryIdActiveOnlyDal = async (req: Request) => {
    const { categoryId } = req.params
    try {
        const result = await prisma.subcategory_master.findMany({
            where: {
                category_masterId: categoryId,
                status: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        })
        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: err?.message }
    }
}

export const getSubcategoryActiveOnlyDal = async (req: Request) => {
    try {
        const result = await prisma.subcategory_master.findMany({
            where: {
                status: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        })
        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: err?.message }
    }
}

export const editSubcategoryDal = async (req: Request) => {
    const { id, name } = req.body
    try {
        if (!id) {
            throw { error: true, message: "ID i required as 'id'" }
        }
        const result = await prisma.subcategory_master.update({
            where: {
                id: id,
            },
            data: {
                name: name,
            },
        })
        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: err?.message }
    }
}

export const switchStatusDal = async (req: Request) => {
    const { id } = req.body
    try {
        const result = await prisma.$executeRaw`update subcategory_master set status = not status where id=${id}`
        if (result === 0) {
            throw { error: true, message: 'Error while switching status' }
        }
        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: err?.message }
    }
}

export const getSubcategoryByIdDal = async (req: Request) => {
    const { id } = req.params
    try {
        if (!id) {
            throw { error: true, message: "ID i required as 'id'" }
        }
        const result = await prisma.subcategory_master.findFirst({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                status: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: err?.message }
    }
}
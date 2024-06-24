import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createSubcategoryDal = async (req: Request) => {
	const { name, category_masterId } = req.body

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

export const getSubcategoryDal = async (req: Request) => {
	try {
		const result = await prisma.subcategory_master.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			include: {
				category: true,
			},
		})
		return result
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

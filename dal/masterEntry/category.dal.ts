import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createCategoryDal = async (req: Request) => {
	const { name } = req.body

	const data: any = {
		name: name,
	}

	try {
		const result = await prisma.category_master.create({
			data: data,
		})
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const getCategoryDal = async (req: Request) => {
	try {
		const result = await prisma.category_master.findMany({
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

export const getCategoryByIdDal = async (req: Request) => {
	const { id } = req.params
	try {
		const result = await prisma.category_master.findFirst({
			where: {
				id: id,
			},
		})
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

export const getCategoryByName = async (name: string) => {
	try {
		const result = await prisma.category_master.findFirst({
			where: {
				name: name,
			},
		})
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

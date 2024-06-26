import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createBrandDal = async (req: Request) => {
	const { name, subcategory } = req.body

	const data: any = {
		name: name,
		subcategory_masterId: subcategory,
	}

	try {
		const result = await prisma.brand_master.create({
			data: data,
		})
		return result
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: err?.message }
	}
}

export const getBrandDal = async (req: Request) => {
	try {
		const result = await prisma.brand_master.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
		})
		return result
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: err?.message }
	}
}

export const getBrandBySubcategoryIdDal = async (req: Request) => {
	const { subcategoryId } = req.params
	try {
		const result = await prisma.brand_master.findMany({
			where: {
				subcategory_masterId: subcategoryId,
			},
		})
		return result
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: err?.message }
	}
}

export const createBrandNoReqDal = async (name: string, subcategory: string) => {
	// const { name, subcategory } = req.body

	const data: any = {
		name: name,
		subcategory_masterId: subcategory,
	}

	try {
		const result = await prisma.brand_master.create({
			data: data,
		})
		return result
	} catch (err: any) {
		console.log(err?.message)
		return { error: true, message: err?.message }
	}
}

export const getBrandBySubcategoryIdActiveOnlyDal = async (req: Request) => {
	const { subcategory } = req.params
	try {
		const result = await prisma.brand_master.findMany({
			where: {
				subcategory_masterId: subcategory,
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

export const getBrandActiveOnlyDal = async (req: Request) => {
	try {
		const result = await prisma.brand_master.findMany({
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

export const editBrandDal = async (req: Request) => {
	const { id, name, subcategory } = req.body
	try {
		if (!id) {
			throw { error: true, message: "ID i required as 'id'" }
		}
		const result = await prisma.brand_master.update({
			where: {
				id: id,
			},
			data: {
				name: name,
				subcategory_masterId: subcategory,
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
		const result = await prisma.$executeRaw`update brand_master set status = not status where id=${id}`
		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}

import { PrismaClient } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'

const prisma = new PrismaClient()

export const extractRoles = async (userId: number) => {
	const data: any = await prisma.$queryRaw`
    select wf_role_id from wf_roleusermaps where user_id=${userId}
    `
	return data.map((item: any) => item?.wf_role_id)
}

export const srAuth = async (req: Request, res: Response, next: NextFunction) => {
	// if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data') && Object.keys(req?.body).length === 0) {
	// 	return next()
	// }
	// const authData = typeof req?.body?.auth === 'string' ? JSON.parse(req?.body?.auth) : req?.body?.auth
	// const roles = await extractRoles(authData?.id)
	// if (!roles) {
	// 	res.status(401).send({ error: true, message: 'Role ID is required' })
	// }
	// if (!roles.includes(Number(process.env.ROLE_SR))) {
	// 	res.status(401).send({ error: true, message: 'User not authorized to access this api' })
	// } else {
	// 	next()
	// }
	next()
}

export const daAuth = async (req: Request, res: Response, next: NextFunction) => {
	// if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data') && Object.keys(req?.body).length === 0) {
	// 	return next()
	// }
	// const authData = typeof req?.body?.auth === 'string' ? JSON.parse(req?.body?.auth) : req?.body?.auth
	// const roles = await extractRoles(authData?.id)
	// if (!roles) {
	// 	res.status(401).send({ error: true, message: 'Role ID is required' })
	// }
	// if (!roles.includes(Number(process.env.ROLE_DA))) {
	// 	res.status(401).send({ error: true, message: 'User not authorized to access this api' })
	// } else {
	// 	next()
	// }
	next()
}

export const accAuth = async (req: Request, res: Response, next: NextFunction) => {
	// if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data') && Object.keys(req?.body).length === 0) {
	// 	return next()
	// }
	// const authData = typeof req?.body?.auth === 'string' ? JSON.parse(req?.body?.auth) : req?.body?.auth
	// const roles = await extractRoles(authData?.id)
	// if (!roles) {
	// 	res.status(401).send({ error: true, message: 'Role ID is required' })
	// }
	// if (!roles.includes(Number(process.env.ROLE_ACC))) {
	// 	res.status(401).send({ error: true, message: 'User not authorized to access this api' })
	// } else {
	// 	next()
	// }
	next()
}

export const distAuth = async (req: Request, res: Response, next: NextFunction) => {
	// if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data') && Object.keys(req?.body).length === 0) {
	// 	return next()
	// }
	// const authData = typeof req?.body?.auth === 'string' ? JSON.parse(req?.body?.auth) : req?.body?.auth
	// const roles = await extractRoles(authData?.id)
	// if (!roles) {
	// 	res.status(401).send({ error: true, message: 'Role ID is required' })
	// }
	// if (!roles.includes(Number(process.env.ROLE_DIST))) {
	// 	res.status(401).send({ error: true, message: 'User not authorized to access this api' })
	// } else {
	// 	next()
	// }
	next()
}

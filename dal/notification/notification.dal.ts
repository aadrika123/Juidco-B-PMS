import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import { extractRoles } from '../../middleware/userAuth'
import getErrorMessage from '../../lib/getErrorMessage'

const prisma = new PrismaClient()

export const getNotificationsDal = async (req: Request) => {
	const authData = typeof req?.body?.auth === 'string' ? JSON.parse(req?.body?.auth) : req?.body?.auth
	try {
		const roles = await extractRoles(authData?.id)
		const notifications = await prisma.notification.findMany({
			where: {
				role_id: {
					in: roles,
				},
			},
			select: {
				id: true,
				title: true,
				description: true,
				isSeen: true,
				destination: true,
				createdAt: true,
			},
            orderBy:{
                createdAt:'desc'
            }
		})
		return notifications ? notifications : null
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const readNotificationDal = async (req: Request) => {
	const {notification_id} = req?.body
	try {
		await prisma.notification.update({
			where: {
				id: String(notification_id),
			},
			data: {
				isSeen: true,
			},
		})
		return 'Notification has been read'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

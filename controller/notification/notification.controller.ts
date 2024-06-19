import { Request, Response } from 'express'
import { getNotificationsDal, readNotificationDal } from '../../dal/notification/notification.dal'

export const getNotifications = async (req: Request, res: Response) => {
	const result: any = await getNotificationsDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Notifications fetched successfully`,
			data: result,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching notifications`,
			error: result?.message,
		})
	}
}

export const readNotification = async (req: Request, res: Response) => {
	const result: any = await readNotificationDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Notification has been read successfully`,
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while reading notification`,
			error: result?.message,
		})
	}
}

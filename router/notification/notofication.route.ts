import express from 'express'
const router = express.Router()
import { getNotifications, readNotification } from '../../controller/notification/notification.controller'

router.get('/', getNotifications)
router.post('/', readNotification)

export default router

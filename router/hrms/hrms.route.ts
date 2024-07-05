import express from 'express'
const router = express.Router()
import { getHandoverData, handoverAcknowledge } from '../../controller/hrms/stockHandover.controller'

//Stock handover routes
router.get('/', getHandoverData)
router.post('/acknowledge', handoverAcknowledge)

export default router

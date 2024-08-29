import express from 'express'
const router = express.Router()
import { getHandoverData, handoverAcknowledge } from '../../controller/hrms/stockHandover.controller'
import { createEmpServiceRequestDal } from '../../dal/hrms/empService.dal'

//Stock handover routes
router.get('/', getHandoverData)
router.post('/acknowledge', handoverAcknowledge)

//employee service routes
router.post('/emp-service/', createEmpServiceRequestDal)
// router.get('/', getHandoverData)

export default router

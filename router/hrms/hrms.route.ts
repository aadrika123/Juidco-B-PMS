import express from 'express'
const router = express.Router()
import { getHandoverData, handoverAcknowledge } from '../../controller/hrms/stockHandover.controller'
import { createEmpServiceRequest, getServiceReqInbox, getServiceReqOutbox } from '../../controller/hrms/empService.controller'

//Stock handover routes
router.get('/', getHandoverData)
router.post('/acknowledge', handoverAcknowledge)

//employee service routes
router.post('/emp-service/', createEmpServiceRequest)
router.get('/emp-service/', getServiceReqInbox)
router.get('/emp-service/outbox', getServiceReqOutbox)

export default router

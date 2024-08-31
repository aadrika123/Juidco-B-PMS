import express from 'express'
import { distAuth } from '../../middleware/userAuth'
const router = express.Router()
import { createServiceRequest, getServiceReqInbox, getServiceReqOutbox } from '../../controller/distributor/distServiceRequest.controller'
import { getEmpServiceReqInbox, getEmpServiceReqOutbox, approveEmpServiceRequest, rejectServiceRequest } from '../../controller/distributor/distEmpServiceRequest.controller'

router.use(distAuth)

router.post('/', createServiceRequest)
router.get('/', getServiceReqInbox)
router.get('/outbox', getServiceReqOutbox)

//Employee service request
router.post('/emp/approve', approveEmpServiceRequest)
router.post('/emp/reject', rejectServiceRequest)
router.get('/emp', getEmpServiceReqInbox)
router.get('/emp/outbox', getEmpServiceReqOutbox)

export default router

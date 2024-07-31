import express from 'express'
import { daAuth } from '../../middleware/userAuth'
const router = express.Router()
import { getServiceReqInbox, getServiceReqOutbox, approveServiceRequest, rejectServiceRequest, returnServiceRequest } from '../../controller/departmentalAdmin/daServiceRequest.controller'

router.use(daAuth)

router.get('/', getServiceReqInbox)
router.get('/outbox', getServiceReqOutbox)
router.post('/to-ia', approveServiceRequest)
router.post('/reject', rejectServiceRequest)
router.post('/return', returnServiceRequest)

export default router

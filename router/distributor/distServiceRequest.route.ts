import express from 'express'
import { distAuth } from '../../middleware/userAuth'
const router = express.Router()
import { createServiceRequest, getServiceReqInbox, getServiceReqOutbox } from '../../controller/distributor/distServiceRequest.controller'

router.use(distAuth)

router.post('/', createServiceRequest)
router.get('/', getServiceReqInbox)
router.get('/outbox', getServiceReqOutbox)

export default router

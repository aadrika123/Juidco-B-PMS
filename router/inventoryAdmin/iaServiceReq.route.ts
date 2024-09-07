import express from 'express'
const router = express.Router()
import { upload } from '../../config/multer.config'
import { getServiceReqInbox, getServiceReqOutbox, approveServiceRequest, rejectServiceRequest, returnServiceRequest } from '../../controller/inventoryAdmin/iaServiceReq.controller'

router.get('/', getServiceReqInbox)
router.get('/outbox', getServiceReqOutbox)
router.post('/approve', upload.array('doc'), approveServiceRequest)
router.post('/reject', rejectServiceRequest)
router.post('/return', returnServiceRequest)

export default router

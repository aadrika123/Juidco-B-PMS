import express from 'express'
const router = express.Router()
import { getServiceReqByServiceNo } from '../../controller/empServiceRequest/serviceReq.controller'

// router.post('/', editServiceRequest)
router.get('/:service_no', getServiceReqByServiceNo)

export default router

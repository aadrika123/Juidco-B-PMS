import express from 'express'
const router = express.Router()
import { getServiceReqByServiceNo, editServiceRequest } from '../../controller/stockRequest/serviceReq.controller'

// router.post('/', editServiceRequest)
router.get('/:service_no', getServiceReqByServiceNo)

export default router

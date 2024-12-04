import express from 'express'
import { daAuth } from '../../middleware/userAuth'
const router = express.Router()
import { getStockReqInbox, getStockReqOutbox, forwardToIa, rejectStockReq, returnStockReq, procurementApproval, forwardToIaDead } from '../../controller/departmentalAdmin/daStockRequest.controller'

router.use(daAuth)

router.get('/', getStockReqInbox)
router.get('/outbox', getStockReqOutbox)
router.post('/to-ia', forwardToIa)
router.post('/to-ia-dead', forwardToIaDead)
router.post('/reject', rejectStockReq)
router.post('/return', returnStockReq)
router.post('/return', returnStockReq)
router.post('/procurement-approval', procurementApproval)

export default router

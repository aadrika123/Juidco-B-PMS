import express from 'express'
const router = express.Router()
import { getStockReqInbox, getStockReqOutbox, approveStockReq, rejectStockReq, returnStockReq } from '../../controller/inventoryAdmin/iaStockReq.controller'

import { iaAuth } from '../../middleware/userAuth'

router.use(iaAuth)

router.get('/', getStockReqInbox)
router.get('/outbox', getStockReqOutbox)
router.post('/approve', approveStockReq)
router.post('/reject', rejectStockReq)
router.post('/return', returnStockReq)

export default router

import express from 'express'
import { distAuth } from '../../middleware/userAuth'
const router = express.Router()
import { createStockRequest, getStockReqInbox, getStockReqOutbox, handover, forwardToDa } from '../../controller/distributor/distStockRequest.controller'

router.use(distAuth)

router.post('/', createStockRequest)
router.get('/', getStockReqInbox)
router.get('/outbox', getStockReqOutbox)
router.post('/to-da', forwardToDa)
router.post('/handover', handover)

export default router

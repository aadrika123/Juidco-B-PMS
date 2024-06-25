import express from 'express'
// import { upload } from '../../../config/multer.config'
import { srAuth } from '../../../middleware/userAuth'
const router = express.Router()
import { approveStockReq, getStockReqInbox, getStockReqOutbox, rejectStockReq, returnStockReq } from '../../../controller/stockReceiver/srStockRequest.controller'

router.use(srAuth)

router.get('/', getStockReqInbox)
router.get('/outbox', getStockReqOutbox)
router.post('/approve', approveStockReq)
router.post('/return', returnStockReq)
router.post('/reject', rejectStockReq)

export default router

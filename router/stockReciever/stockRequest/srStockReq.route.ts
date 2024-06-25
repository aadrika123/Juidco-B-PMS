import express from 'express'
import { upload } from '../../../config/multer.config'
import { srAuth } from '../../../middleware/userAuth'
const router = express.Router()
import { approveStockReq, getStockReqInbox, getStockReqOutbox } from '../../../controller/stockReceiver/srStockRequest.controller'

router.use(srAuth)

router.get('/', getStockReqInbox)
router.get('/outbox', getStockReqOutbox)
router.post('/approve', approveStockReq)

export default router

import express from 'express'
// import { upload } from '../../../config/multer.config'
import { srAuth } from '../../../middleware/userAuth'
const router = express.Router()
import { approveStockReq, getStockReqInbox, getStockReqOutbox, rejectStockReq, returnStockReq, stockReturnApproval, deadStockApproval, claimWarranty, stockReturnReject, stockReturnReqReturn, deadStockReject, deadStockReturn, warrantyClaimReject, warrantyClaimReturn } from '../../../controller/stockReceiver/srStockRequest.controller'

router.use(srAuth)

router.get('/', getStockReqInbox)
router.get('/outbox', getStockReqOutbox)
router.post('/approve', approveStockReq)
router.post('/return', returnStockReq)
router.post('/reject', rejectStockReq)
router.post('/approve-return-inv', stockReturnApproval)
router.post('/reject-return-inv', stockReturnReject)
router.post('/return-return-inv', stockReturnReqReturn)
router.post('/approve-dead-stock', deadStockApproval)
router.post('/reject-dead-stock', deadStockReject)
router.post('/return-dead-stock', deadStockReturn)
router.post('/approve-warranty', claimWarranty)
router.post('/reject-warranty', warrantyClaimReject)
router.post('/return-warranty', warrantyClaimReturn)

export default router

import express from 'express'
const router = express.Router()
import { getStockReqByStockHandoverNo, editStockRequest } from '../../controller/stockRequest/stockReq.controller'

router.post('/', editStockRequest)
router.get('/:stock_handover_no', getStockReqByStockHandoverNo)

export default router

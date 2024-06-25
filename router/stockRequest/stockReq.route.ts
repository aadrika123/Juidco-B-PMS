import express from 'express'
const router = express.Router()
import { getStockReqByStockHandoverNo } from '../../controller/stockRequest/stockReq.controller'

router.get('/:stock_handover_no', getStockReqByStockHandoverNo)

export default router

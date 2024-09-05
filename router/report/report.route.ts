import express from 'express'
const router = express.Router()
import { getTotalStocks, getDeadStocks, getStockMovement } from '../../controller/report/inventoryReport.controller'
import { getPreProcurementReport } from '../../controller/report/preProcurementReport.controller'

//inventory reports
router.get('/inventory/total', getTotalStocks)
router.get('/inventory/dead', getDeadStocks)
router.get('/inventory/movement', getStockMovement)

//pre procurement reports
router.get('/inventory/pre-procurement', getPreProcurementReport)

export default router

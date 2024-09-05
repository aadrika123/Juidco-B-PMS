import express from 'express'
const router = express.Router()
import { getTotalStocks, getDeadStocks, getStockMovement } from '../../controller/report/inventoryReport.controller'
import { getPreProcurementReport } from '../../controller/report/preProcurementReport.controller'
import { getPostProcurementReport } from '../../controller/report/postProcurementReport.controller'
import { getDistStockReqReport, getDistServiceReqReport } from '../../controller/report/levelWiseReport/dd/distReport.controller'
import { getDaStockReqReport, getDaServiceReqReport } from '../../controller/report/levelWiseReport/da/daReport.controller'
import { getIaStockReqReport, getIaServiceReqReport } from '../../controller/report/levelWiseReport/ia/iaReport.controller'

//inventory reports------------------------------------------------------------------------------------------------------
router.get('/inventory/total', getTotalStocks)
router.get('/inventory/dead', getDeadStocks)
router.get('/inventory/movement', getStockMovement)

//pre procurement reports------------------------------------------------------------------------------------------------------
router.get('/pre-procurement', getPreProcurementReport)

//post procurement reports------------------------------------------------------------------------------------------------------
router.get('/post-procurement', getPostProcurementReport)

//levelwise reports------------------------------------------------------------------------------------------------------
//dd
router.get('/level-wise/dd/stock-request', getDistStockReqReport)
router.get('/level-wise/dd/service-request', getDistServiceReqReport)

//da
router.get('/level-wise/da/stock-request', getDaStockReqReport)
router.get('/level-wise/da/service-request', getDaServiceReqReport)

//ia
router.get('/level-wise/ia/stock-request', getIaStockReqReport)
router.get('/level-wise/ia/service-request', getIaServiceReqReport)


export default router

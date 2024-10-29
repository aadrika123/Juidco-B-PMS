import express from 'express'
const router = express.Router()
import { getTotalStocks, getDeadStocks, getStockMovement } from '../../controller/report/inventoryReport.controller'
import { getPreProcurementReport } from '../../controller/report/preProcurementReport.controller'
import { getPostProcurementReport } from '../../controller/report/postProcurementReport.controller'
import { getDistStockReqReport, getDistServiceReqReport } from '../../controller/report/levelWiseReport/dd/distReport.controller'
import { getDaStockReqReport, getDaServiceReqReport } from '../../controller/report/levelWiseReport/da/daReport.controller'
import { getIaStockReqReport, getIaServiceReqReport, getIaProcurementReport, getIaBoqReport, getIaTenderReport } from '../../controller/report/levelWiseReport/ia/iaReport.controller'
import { getLevel1ProcurementReport } from '../../controller/report/levelWiseReport/level1/level1Report.controller'
import { getLevel2ProcurementReport } from '../../controller/report/levelWiseReport/level2/level2Report.controller'
import { getFinanceBoqReport } from '../../controller/report/levelWiseReport/finance/financeReport.controller'
import { getTaTenderReport } from '../../controller/report/levelWiseReport/ta/taReport.controller'
import { getStockList, getStockHistory } from '../../controller/report/stockHistory.controller'
import { getTenderReport } from '../../controller/report/tender.controller'
import { getWarrantyReport } from '../../controller/report/warranty.controller'




//inventory reports------------------------------------------------------------------------------------------------------
router.get('/inventory/total', getTotalStocks)
router.get('/inventory/dead', getDeadStocks)
router.get('/inventory/movement', getStockMovement)

//pre procurement reports------------------------------------------------------------------------------------------------------
router.get('/pre-procurement', getPreProcurementReport)

//post procurement reports------------------------------------------------------------------------------------------------------
router.get('/post-procurement', getPostProcurementReport)

//level wise reports------------------------------------------------------------------------------------------------------
//dd
router.get('/level-wise/dd/stock-request', getDistStockReqReport)
router.get('/level-wise/dd/service-request', getDistServiceReqReport)
//da
router.get('/level-wise/da/stock-request', getDaStockReqReport)
router.get('/level-wise/da/service-request', getDaServiceReqReport)
//ia
router.get('/level-wise/ia/stock-request', getIaStockReqReport)
router.get('/level-wise/ia/service-request', getIaServiceReqReport)
router.get('/level-wise/ia/procurement', getIaProcurementReport)
router.get('/level-wise/ia/boq', getIaBoqReport)
router.get('/level-wise/ia/tender', getIaTenderReport)
//level1
router.get('/level-wise/level1/procurement', getLevel1ProcurementReport)
//level2
router.get('/level-wise/level2/procurement', getLevel2ProcurementReport)
//finance
router.get('/level-wise/finance/boq', getFinanceBoqReport)
//ta
router.get('/level-wise/ta/tender', getTaTenderReport)

//stock history
router.get('/stock-history/list', getStockList)
router.get('/stock-history/:inventory', getStockHistory)

//tender
router.get('/tender', getTenderReport)

//warranty claim
router.get('/warranty', getWarrantyReport)


export default router

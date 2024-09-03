import express from 'express'
const router = express.Router()
import { getTotalStocks } from '../../controller/report/inventoryReport.controller'

// import { level2Auth } from '../../middleware/userAuth'

// router.use(level2Auth)

//inventory reports
router.get('/inventory/total', getTotalStocks)

export default router

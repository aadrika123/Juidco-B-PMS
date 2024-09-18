import express, { Request, Response } from 'express'
import { config } from 'dotenv'
import swagger from './lib/swagger'
const cors = require('cors')

import devRoute from './router/dev/dev.route'

import masterEntryRoute from './router/masterEntry/masterEntry.route'
import srPreProcurementRoute from './router/stockReciever/preProcurement/srPreProcurement.route'
import daPreProcurementRoute from './router/departmenalAdmin/preProcurement/daPreProcurement.route'
import downloadRoute from './router/download/download.route'
import daPostProcurementRoute from './router/departmenalAdmin/postPrecurement/daPostProcurement.route'
import daReceivedInventoryRoute from './router/departmenalAdmin/receivedInventory/receivedInventory.route'
import srPostProcurementRoute from './router/stockReciever/postPrecurement/srPostProcurement.route'
import srReceivedInventoryRoute from './router/stockReciever/receivedInventory/receivedInventory.route'
import inventoryRoute from './router/inventory/inventory.route'
import accPreProcurementRoute from './router/accountant/preProcurement/accPreProcurement.route'
import boqRoute from './router/boq/boq.route'
import otherRoute from './router/other/imageUploader.route'
import preTenderRoute from './router/preTender/preTender.route'
import notificationRoute from './router/notification/notofication.route'
import distStockRequestRoute from './router/distributor/distStockRequest.route'
import daStockRequestRoute from './router/departmenalAdmin/daStockReq.route'
import iaStockRequestRoute from './router/inventoryAdmin/iaStockReq.route'
import srStockRequestRoute from './router/stockReciever/stockRequest/srStockReq.route'
import stockRequestRoute from './router/stockRequest/stockReq.route'
import serviceRequestRoute from './router/stockRequest/serviceReq.route'
import empServiceRoutes from './router/empServiceRequest/empServiceReq.route'
import iaServiceRequestRoute from './router/inventoryAdmin/iaServiceReq.route'
import daServiceRequestRoute from './router/departmenalAdmin/daServiceReq.route'
import ddServiceRequestRoute from './router/distributor/distServiceRequest.route'
import hrmsRoute from './router/hrms/hrms.route'
import level1Routes from './router/level1/level1.route'
import level2Routes from './router/level2/level2.route'
import financeRoutes from './router/finance/finance.route'
import procurementRoute from './router/procurement/procurement.route'
import tenderingAdminRoute from './router/tenderingAdmin/ta.route'
import biddingRoute from './router/bidding/bidding.route'
import reportRoute from './router/report/report.route'
import dashboardRoutes from './router/dashboard/dashboard.route'

config()

const app = express()
const port = process.env.PORT || 6969
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/pms', (req: Request, res: Response) => {
	res.send('Procurement and Inventory Management System backend')
})
// dev routes with protection
app.use('/api/pms/dev', devRoute)

//----------------------------routes--------------------------------------------------------------------------------------------------------------------------
//procurement routes
app.use('/api/pms/master', masterEntryRoute)
app.use('/api/pms/ia', srPreProcurementRoute)
app.use('/api/pms/da', daPreProcurementRoute)
app.use('/api/pms/acc/pre-procurement', accPreProcurementRoute)
app.use('/api/pms/download', downloadRoute)
app.use('/api/pms/da/post-procurement', daPostProcurementRoute)
app.use('/api/pms/da/rec-inv', daReceivedInventoryRoute)
app.use('/api/pms/sr/post-procurement', srPostProcurementRoute)
app.use('/api/pms/sr/rec-inv', srReceivedInventoryRoute)
app.use('/api/pms/procurement', procurementRoute)

//level 1 & 2
app.use('/api/pms/level1', level1Routes)
app.use('/api/pms/level2', level2Routes)

//stock request routes
app.use('/api/pms/dist/stock-request', distStockRequestRoute)
app.use('/api/pms/da/stock-request', daStockRequestRoute)
app.use('/api/pms/ia/stock-request', iaStockRequestRoute)
app.use('/api/pms/sr/stock-request', srStockRequestRoute)

//service request routes
app.use('/api/pms/dist/service-request', ddServiceRequestRoute)
app.use('/api/pms/da/service-request', daServiceRequestRoute)
app.use('/api/pms/ia/service-request', iaServiceRequestRoute)

//unprotected stock request routes
app.use('/api/pms/stock-request', stockRequestRoute)

//unprotected service request routes
app.use('/api/pms/service-request', serviceRequestRoute)

//unprotected employe  service request routes
app.use('/api/pms/emp-service', empServiceRoutes)

//inventory routes
app.use('/api/pms/inventory', inventoryRoute)

//routes that are not for a single role only
app.use('/api/pms/boq', boqRoute)
app.use('/api/pms/pre-tender', preTenderRoute)
app.use('/api/pms/', otherRoute)

//notification routes
app.use('/api/pms/notification', notificationRoute)

//hrms stock handover routes
app.use('/api/pms/stock-handover', hrmsRoute)

//finance routes
app.use('/api/pms/finance', financeRoutes)

//tendering admin routes
app.use('/api/pms/ta', tenderingAdminRoute)

//unprotected bidding routes
app.use('/api/pms/bidding', biddingRoute)

//report routes
app.use('/api/pms/report', reportRoute)

//dashboard routes
app.use('/api/pms/dashboard', dashboardRoutes)

//----------------------------routes--------------------------------------------------------------------------------------------------------------------------

//swagger
swagger(app)

app.listen(port, () => {
	console.log(`Procurement and Inventory Management System is listening on port ${port}`)
})

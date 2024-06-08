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


config()

const app = express()
const port = process.env.PORT || 6969
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/api/pms', (req: Request, res: Response) => {
    res.send('Procurement and Inventory Management System backend')
})
// dev routes with protection
app.use('/api/pms/dev', devRoute)

//----------------------------routes--------------------------------------------------------------------------------------------------------------------------
//procurement route
app.use('/api/pms/master', masterEntryRoute)
app.use('/api/pms/sr', srPreProcurementRoute)
app.use('/api/pms/da', daPreProcurementRoute)
app.use('/api/pms/acc/pre-procurement', accPreProcurementRoute)
app.use('/api/pms/download', downloadRoute)
app.use('/api/pms/da/post-procurement', daPostProcurementRoute)
app.use('/api/pms/da/rec-inv', daReceivedInventoryRoute)
app.use('/api/pms/sr/post-procurement', srPostProcurementRoute)
app.use('/api/pms/sr/rec-inv', srReceivedInventoryRoute)


//inventory route
app.use('/api/pms/inventory', inventoryRoute)


//routes that are not for a single role only
app.use('/api/pms/boq', boqRoute)

//----------------------------routes--------------------------------------------------------------------------------------------------------------------------

//swagger
swagger(app)

app.listen(port, () => {
    console.log(`Procurement and Inventory Management System is listening on port ${port}`)
})
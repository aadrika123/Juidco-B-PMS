import express, { Request, Response } from 'express'
import { config } from 'dotenv'
const cors = require('cors')

import masterEntryRoute from './router/masterEntry/masterEntry.route'
import srPreProcurementRoute from './router/stockReciever/preProcurement/srPreProcurement.route'

config()

const app = express()
const port = process.env.PORT || 6969
app.use(cors());

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Procurement and Inventory Management System backend')
})

//routes

app.use('/api/master', masterEntryRoute)
app.use('/api/sr', srPreProcurementRoute)


app.listen(port, () => {
    console.log(`Procurement and Inventory Management System is listening on port ${port}`)
})
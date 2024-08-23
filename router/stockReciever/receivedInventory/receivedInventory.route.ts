import express from 'express'
import { upload } from '../../../config/multer.config'
import { iaAuth } from '../../../middleware/userAuth'
const router = express.Router()
import { getReceivedInventory, getReceivedInventoryById, getReceivedInventoryByOrderNo, addToInventory, getReceivedInventoryOutbox, getReceivedInventoryOutboxById, addProduct } from '../../../controller/stockReceiver/srReceivedInventory.controller'

router.use(iaAuth)

router.get('/', getReceivedInventory)
router.get('/outbox', getReceivedInventoryOutbox)
router.get('/by-order-no/:order_no', getReceivedInventoryByOrderNo)
router.post('/add-to-inv', upload.array('img'), iaAuth, addToInventory)
router.post('/add-product', addProduct)
router.get('/outbox/:id', getReceivedInventoryOutboxById)
router.get('/:id', getReceivedInventoryById)

export default router

import express from 'express'
import { upload } from '../../../config/multer.config'
import { iaAuth } from '../../../middleware/userAuth'
const router = express.Router()
import { getReceivedInventory, getReceivedInventoryById, getReceivedInventoryByOrderNo, createReceiving, getReceivedInventoryOutbox, getReceivedInventoryOutboxById } from '../../../controller/departmentalAdmin/daReceivedInventory.controller'

router.use(iaAuth)

router.get('/', getReceivedInventory)
router.get('/outbox', getReceivedInventoryOutbox)
router.get('/by-order-no/:procurement_no', getReceivedInventoryByOrderNo)
router.post('/receive', upload.array('img'), iaAuth, createReceiving)
// router.get('/outbox', createReceiving)
router.get('/outbox/:id', getReceivedInventoryOutboxById)
router.get('/:id', getReceivedInventoryById)

export default router

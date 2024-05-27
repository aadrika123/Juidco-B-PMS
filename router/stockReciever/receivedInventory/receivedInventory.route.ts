import express from "express";
import { upload } from "../../../config/multer.config";
const router = express.Router()
import {
    getReceivedInventory,
    getReceivedInventoryById,
    getReceivedInventoryByOrderNo,
    // createReceiving,
    getReceivedInventoryOutbox,
    getReceivedInventoryOutboxById
} from "../../../controller/stockReceiver/srReceivedInventory.controller";


router.get('/', getReceivedInventory)
router.get('/outbox', getReceivedInventoryOutbox)
router.get('/by-order-no/:order_no', getReceivedInventoryByOrderNo)
// router.post('/receive', upload.array('img'), createReceiving)
// router.get('/outbox', createReceiving)
router.get('/outbox/:id', getReceivedInventoryOutboxById)
router.get('/:id', getReceivedInventoryById)



export default router
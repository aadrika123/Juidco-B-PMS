import express from "express";
import { upload } from "../../../config/multer.config";
const router = express.Router()
import {
    getReceivedInventory,
    getReceivedInventoryById,
    getReceivedInventoryByOrderNo,
    addToInventory,
    getReceivedInventoryOutbox,
    getReceivedInventoryOutboxById
} from "../../../controller/stockReceiver/srReceivedInventory.controller";


router.get('/', getReceivedInventory)
router.get('/outbox', getReceivedInventoryOutbox)
router.get('/by-order-no/:order_no', getReceivedInventoryByOrderNo)
router.post('/add-to-inv', upload.array('img'), addToInventory)
router.get('/outbox/:id', getReceivedInventoryOutboxById)
router.get('/:id', getReceivedInventoryById)



export default router
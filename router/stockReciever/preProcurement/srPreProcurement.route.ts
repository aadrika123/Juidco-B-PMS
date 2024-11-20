import express from "express";
import { upload } from "../../../config/multer.config";
import { iaAuth } from "../../../middleware/userAuth";
const router = express.Router()
import {
    createPreProcurement,
    forwardToDa,
    getPreProcurement,
    getPreProcurementById,
    getPreProcurementByOrderNo,
    getPreProcurementOutbox,
    getPreProcurementOutboxById,
    getPreProcurementRejected,
    getPreProcurementReleased,
    editPreProcurement,
    forwardToLevel1,
    getInventoryData,
    getInventoryByHandoverNo
} from "../../../controller/stockReceiver/srPreProcurement.controller";

router.use(iaAuth)

router.post('/pre-procurement', createPreProcurement)
router.get('/pre-procurement', getPreProcurement)
router.get('/deadstock', getInventoryData)
router.get('/deadstockby/:id', getInventoryByHandoverNo)
router.get('/pre-procurement/rejected', getPreProcurementRejected)
router.get('/pre-procurement/released', getPreProcurementReleased)
router.get('/pre-procurement/outbox', getPreProcurementOutbox)
router.get('/pre-procurement/outbox/:id', getPreProcurementOutboxById)
router.get('/pre-procurement/:id', getPreProcurementById)
router.get('/pre-procurement/by-order-no/:order_no', getPreProcurementByOrderNo)
router.post('/pre-procurement/to-da', upload.array('img'), iaAuth, forwardToDa)
router.post('/pre-procurement/to-level1', upload.array('img'), iaAuth, forwardToLevel1)
router.post('/pre-procurement/edit', editPreProcurement)


export default router
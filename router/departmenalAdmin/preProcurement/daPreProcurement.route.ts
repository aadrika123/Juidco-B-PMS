import express from "express";
import { upload } from "../../../config/multer.config";
import { daAuth } from "../../../middleware/userAuth";
const router = express.Router()
import {
    backToSr,
    getPreProcurement,
    getPreProcurementById,
    getPreProcurementByOrderNo,
    editPreProcurement,
    releaseForTender,
    getPreProcurementOutbox,
    getPreProcurementOutboxById,
    reject
} from "../../../controller/departmentalAdmin/daPreProcurement.controller";

// router.use(daAuth)

router.get('/pre-procurement', getPreProcurement)
router.get('/pre-procurement/outbox', getPreProcurementOutbox)
router.get('/pre-procurement/outbox/:id', getPreProcurementOutboxById)
router.get('/pre-procurement/:id', getPreProcurementById)
router.get('/pre-procurement/by-order-no/:order_no', getPreProcurementByOrderNo)
router.post('/pre-procurement/to-sr', backToSr)
router.post('/pre-procurement/edit', editPreProcurement)
router.post('/pre-procurement/release-tender', upload.array('img'), releaseForTender)
router.post('/pre-procurement/reject', reject)



export default router
import express from "express";
const router = express.Router()
import {
    backToSr,
    getPreProcurement,
    getPreProcurementById,
    getPreProcurementByOrderNo,
    editPreProcurement,
    releaseForTender,
    getPreProcurementOutbox,
    getPreProcurementOutboxById
} from "../../../controller/departmentalAdmin/daPreProcurement.controller";


router.get('/pre-procurement', getPreProcurement)
router.get('/pre-procurement/outbox', getPreProcurementOutbox)
router.get('/pre-procurement/outbox/:id', getPreProcurementOutboxById)
router.get('/pre-procurement/:id', getPreProcurementById)
router.get('/pre-procurement/by-order-no/:order_no', getPreProcurementByOrderNo)
router.post('/pre-procurement/to-sr', backToSr)
router.post('/pre-procurement/edit', editPreProcurement)
router.post('/pre-procurement/release-tender', releaseForTender)



export default router
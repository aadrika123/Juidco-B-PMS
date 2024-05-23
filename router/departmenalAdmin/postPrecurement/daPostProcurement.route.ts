import express from "express";
const router = express.Router()
import {
    getPostProcurement,
    getPostProcurementById,
    getPostProcurementByOrderNo,
    SaveAdditionalDetailsProcurement
} from "../../../controller/departmentalAdmin/daPostProcurement.controller";


router.get('/', getPostProcurement)
// router.get('/pre-procurement/outbox', getPreProcurementOutbox)
router.get('/:id', getPostProcurementById)
// router.get('/pre-procurement/:id', getPreProcurementById)
router.get('/by-order-no/:order_no', getPostProcurementByOrderNo)
// router.post('/pre-procurement/to-sr', backToSr)
router.post('/save-additional-details', SaveAdditionalDetailsProcurement)
// router.post('/pre-procurement/release-tender', releaseForTender)
// router.post('/pre-procurement/reject', reject)



export default router
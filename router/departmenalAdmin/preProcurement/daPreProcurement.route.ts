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
    reject,
    rejectByProcurementNo,
    forwardToAccountant,
    getBoqInbox,
    getBoqOutbox,
    returnToAccountant,
    getPreTenderingInbox,
    getPreTenderingOutbox,
    rejectBoq,
    approveBoqForPt,
    approvePreTender,
    rejectPreTender
} from "../../../controller/departmentalAdmin/daPreProcurement.controller";

router.use(daAuth)


router.get('/pre-procurement/pre-tender', getPreTenderingInbox)
router.get('/pre-procurement/pre-tender/outbox', getPreTenderingOutbox)
router.get('/pre-procurement/boq', getBoqInbox)
router.get('/pre-procurement', getPreProcurement)
router.get('/pre-procurement/boq/outbox', getBoqOutbox)
router.get('/pre-procurement/outbox', getPreProcurementOutbox)
router.get('/pre-procurement/outbox/:id', getPreProcurementOutboxById)
router.get('/pre-procurement/:id', getPreProcurementById)
router.get('/pre-procurement/by-order-no/:order_no', getPreProcurementByOrderNo)
router.post('/pre-procurement/to-sr', backToSr)
router.post('/pre-procurement/edit', editPreProcurement)
router.post('/pre-procurement/release-tender', upload.array('img'), releaseForTender)
router.post('/pre-procurement/reject', reject)
router.post('/pre-procurement/reject-procurement-no', rejectByProcurementNo)
router.post('/pre-procurement/to-acc-boq', upload.array('img'), forwardToAccountant)
router.post('/pre-procurement/boq/return-boq', returnToAccountant)
router.post('/pre-procurement/boq/reject', rejectBoq)
router.post('/pre-procurement/boq/approve', approveBoqForPt)
router.post('/pre-procurement/pre-tender/approve', upload.array('img'), approvePreTender)
router.post('/pre-procurement/pre-tender/reject', rejectPreTender)



export default router
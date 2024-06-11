import express from "express";
import { upload } from "../../../config/multer.config";
import { accAuth } from "../../../middleware/userAuth";
const router = express.Router()
import {
    getPreProcurement,
    getPreProcurementBulkByOrderNo,
    createBoq,
    getPreProcurementForBoq,
    getBoqInbox,
    getBoqOutbox,
    getPreProcurementOutbox,
    forwardToDa,
    getPreTenderingInbox,
    getPreTenderingOutbox,
    createBasicDetailsPt,
    getBasicDetailsPt,
    createWorkDetailsPt
} from "../../../controller/accountant/accPreProcurement.controller";

// router.use(accAuth)

router.get('/list-for-boq', getPreProcurementForBoq)
router.get('/', getPreProcurement)
router.get('/outbox', getPreProcurementOutbox)
router.post('/bulk', getPreProcurementBulkByOrderNo)
router.post('/boq', upload.array('img'), createBoq)
router.get('/boq', getBoqInbox)
router.get('/boq/outbox', getBoqOutbox)
router.post('/to-da', forwardToDa)
router.get('/pre-tender', getPreTenderingInbox)
router.get('/pre-tender/outbox', getPreTenderingOutbox)
router.post('/pre-tender/basic-details', upload.array('img'), createBasicDetailsPt)
router.post('/pre-tender/work-details', upload.array('img'), createWorkDetailsPt)
router.get('/pre-tender/basic-details/:reference_no', getBasicDetailsPt)


export default router
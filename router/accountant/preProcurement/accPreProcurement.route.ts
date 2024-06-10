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
    forwardToDa
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



export default router
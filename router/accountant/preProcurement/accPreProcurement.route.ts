import express from "express";
import { upload } from "../../../config/multer.config";
import { accAuth } from "../../../middleware/userAuth";
const router = express.Router()
import {
    // backToSr,
    getPreProcurement,
    // getPreProcurementById,
    getPreProcurementBulkByOrderNo,
    createBoq,
    getPreProcurementForBoq
    // editPreProcurement,
    // releaseForTender,
    // getPreProcurementOutbox,
    // getPreProcurementOutboxById,
    // reject
} from "../../../controller/accountant/accPreProcurement.controller";

// router.use(accAuth)

router.get('/list-for-boq', getPreProcurementForBoq)
router.get('/', getPreProcurement)
// router.get('/pre-procurement/outbox', getPreProcurementOutbox)
// router.get('/pre-procurement/outbox/:id', getPreProcurementOutboxById)
// router.get('/pre-procurement/:id', getPreProcurementById)
router.post('/bulk', getPreProcurementBulkByOrderNo)
router.post('/boq', upload.array('img'), createBoq)
// router.post('/pre-procurement/edit', editPreProcurement)
// router.post('/pre-procurement/release-tender', upload.array('img'), releaseForTender)
// router.post('/pre-procurement/reject', reject)



export default router
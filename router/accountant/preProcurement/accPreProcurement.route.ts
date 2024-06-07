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
    getPreProcurementOutbox
} from "../../../controller/accountant/accPreProcurement.controller";

// router.use(accAuth)

router.get('/list-for-boq', getPreProcurementForBoq)
router.get('/', getPreProcurement)
router.get('/outbox', getPreProcurementOutbox)
// router.get('/pre-procurement/outbox/:id', getPreProcurementOutboxById)
// router.get('/pre-procurement/:id', getPreProcurementById)
router.post('/bulk', getPreProcurementBulkByOrderNo)
router.post('/boq', upload.array('img'), createBoq)
router.get('/boq', getBoqInbox)
router.get('/boq/outbox', getBoqOutbox)
// router.post('/pre-procurement/edit', editPreProcurement)
// router.post('/pre-procurement/release-tender', upload.array('img'), releaseForTender)
// router.post('/pre-procurement/reject', reject)



export default router
import express from "express";
const router = express.Router()
import {
    getTaInbox,
    getTaOutbox,
    selectBidType,
    addCriteria,
    submitCriteria,
    addBidderDetails,
    submitBidderDetails,
    comparison,
    comparisonResult
} from "../../controller/tenderingAdmin/ta.controller";
import { upload } from "../../config/multer.config";


router.get('/', getTaInbox)
router.get('/outbox', getTaOutbox)
router.post('/bid-type', selectBidType)
router.post('/add-criteria', addCriteria)
router.post('/submit-criteria', submitCriteria)
router.post('/add-bidder', upload.fields([{ name: 'emd_doc' }, { name: 'tech_doc' }, { name: 'fin_doc' }]), addBidderDetails)
router.post('/submit-bidder', submitBidderDetails)
router.post('/compare', comparison)
router.get('/comparison-result/:reference_no', comparisonResult)


export default router
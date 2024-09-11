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
    comparisonResult,
    selectWinner,
    finalizeComparison,
    setUnitPrice,
    setComparisonRatio
} from "../../controller/tenderingAdmin/ta.controller";
import { upload } from "../../config/multer.config";

import { taAuth } from "../../middleware/userAuth";

router.use(taAuth)


router.get('/', getTaInbox)
router.get('/outbox', getTaOutbox)
router.post('/bid-type', selectBidType)
router.post('/add-criteria', addCriteria)
router.post('/submit-criteria', submitCriteria)
router.post('/add-bidder', upload.fields([{ name: 'emd_doc' }, { name: 'tech_doc' }, { name: 'fin_doc' }]), taAuth, addBidderDetails)
router.post('/submit-bidder', submitBidderDetails)
router.post('/compare', comparison)
router.post('/select-winner', selectWinner)
router.post('/comparison-finalize', finalizeComparison)
router.get('/comparison-result/:reference_no', comparisonResult)
router.post('/add-unit-price', setUnitPrice)
router.post('/set-comparison-ratio', setComparisonRatio)


export default router
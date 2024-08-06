import express from "express";
const router = express.Router()
import {
    getTaInbox,
    getTaOutbox,
    selectBidType,
    addCriteria,
    addBidderDetails,
    submitBidderDetails
} from "../../controller/tenderingAdmin/ta.controller";
import { upload } from "../../config/multer.config";


router.get('/', getTaInbox)
router.get('/outbox', getTaOutbox)
router.post('/bid-type', selectBidType)
router.post('/criteria', addCriteria)
router.post('/add-bidder', upload.fields([{ name: 'emd_doc' }, { name: 'bidder_doc' }]), addBidderDetails)
router.post('/submit-bidder', submitBidderDetails)


export default router
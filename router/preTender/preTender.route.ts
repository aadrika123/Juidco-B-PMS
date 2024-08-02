import express from "express";
const router = express.Router()
import {
    getPreTender,
    createPreTenderDetails,
    getPreTenderDetails
} from "../../controller/preTender/preTender.controller";


router.post('/details', createPreTenderDetails)
router.get('/details/:reference_no', getPreTenderDetails)
router.get('/:reference_no', getPreTender)


export default router
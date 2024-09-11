import express from "express";
const router = express.Router()
import {
    getPreTender,
    createPreTenderDetails,
    getPreTenderDetails,
    addNoOfCovers
} from "../../controller/preTender/preTender.controller";


router.post('/details', createPreTenderDetails)
router.post('/add-covers', addNoOfCovers)
router.get('/details/:reference_no', getPreTenderDetails)
router.get('/:reference_no', getPreTender)


export default router
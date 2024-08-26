import express from "express";
const router = express.Router()
import {
    getBidDetails,
    getProcurementDetailsByRefNo,
    getRateContractDetailsNo
} from "../../controller/bidding/bidding.controller";


router.get('/rate-contract-details/:category', getRateContractDetailsNo)
router.get('/procurement-details/:reference_no', getProcurementDetailsByRefNo)
router.get('/:reference_no', getBidDetails)


export default router
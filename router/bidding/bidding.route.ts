import express from "express";
const router = express.Router()
import {
    getBidDetails,
    getProcurementDetailsByRefNo,
    getRateContractDetailsNo,
    getBidderById,
    getAllRateContractDetailsNo
} from "../../controller/bidding/bidding.controller";


router.get('/rate-contract-details/:category', getRateContractDetailsNo)
router.get('/all-rate-contract-details/:category', getAllRateContractDetailsNo)
router.get('/procurement-details/:reference_no', getProcurementDetailsByRefNo)
router.get('/:reference_no', getBidDetails)
router.get('/bidder/:id', getBidderById)


export default router
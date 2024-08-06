import express from "express";
const router = express.Router()
import {
    getBidDetails
} from "../../controller/bidding/bidding.controller";


router.get('/:reference_no', getBidDetails)


export default router
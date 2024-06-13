import express from "express";
const router = express.Router()
import {
    getPreTender
} from "../../controller/preTender/preTender.controller";


router.get('/:reference_no', getPreTender)


export default router
import express from "express";
const router = express.Router()
import { srAuth } from "../../../middleware/userAuth";
import {
    getPostProcurement,
    getPostProcurementById,
    getPostProcurementByOrderNo
} from "../../../controller/stockReceiver/srPostProcurement.controller";

// router.use(srAuth)

router.get('/', getPostProcurement)
router.get('/by-order-no/:order_no', getPostProcurementByOrderNo)
router.get('/:id', getPostProcurementById)



export default router
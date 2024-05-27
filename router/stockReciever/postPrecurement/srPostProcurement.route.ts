import express from "express";
const router = express.Router()
import {
    getPostProcurement,
    getPostProcurementById,
    getPostProcurementByOrderNo
} from "../../../controller/stockReceiver/srPostProcurement.controller";


router.get('/', getPostProcurement)
router.get('/by-order-no/:order_no', getPostProcurementByOrderNo)
router.get('/:id', getPostProcurementById)



export default router
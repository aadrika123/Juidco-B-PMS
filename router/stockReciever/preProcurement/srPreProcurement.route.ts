import express from "express";
const router = express.Router()
import { createPreProcurement, forwardToDa, getPreProcurement, getPreProcurementById, getPreProcurementByOrderNo } from "../../../controller/stockReceiver/srPreProcurement.controller";


router.post('/pre-procurement', createPreProcurement)
router.get('/pre-procurement', getPreProcurement)
router.get('/pre-procurement/:id', getPreProcurementById)
router.get('/pre-procurement/by-order-no/:order_no', getPreProcurementByOrderNo)
router.post('/pre-procurement/to-da', forwardToDa)


export default router
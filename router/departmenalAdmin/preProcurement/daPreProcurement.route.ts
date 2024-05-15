import express from "express";
const router = express.Router()
import { backToSr, getPreProcurement, getPreProcurementById, getPreProcurementByOrderNo, editPreProcurement, releaseForTender } from "../../../controller/departmentalAdmin/daPreProcurement.controller";


router.get('/pre-procurement', getPreProcurement)
router.get('/pre-procurement/:id', getPreProcurementById)
router.get('/pre-procurement/by-order-no/:order_no', getPreProcurementByOrderNo)
router.post('/pre-procurement/to-sr', backToSr)
router.post('/pre-procurement/edit', editPreProcurement)
router.post('/pre-procurement/release-tender', releaseForTender)



export default router
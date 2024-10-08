import express from "express";
const router = express.Router()
import { iaAuth } from "../../../middleware/userAuth";
import {
    getPostProcurement,
    getPostProcurementById,
    getPostProcurementByOrderNo,
    SaveAdditionalDetailsProcurement,
    getPostProcurementOutbox,
    getPostProcurementOutboxById,
} from "../../../controller/departmentalAdmin/daPostProcurement.controller";

router.use(iaAuth)

router.get('/', getPostProcurement)
router.get('/by-order-no/:order_no', getPostProcurementByOrderNo)
router.post('/save-additional-details', SaveAdditionalDetailsProcurement)
router.get('/outbox', getPostProcurementOutbox)
router.get('/outbox/:id', getPostProcurementOutboxById)
router.get('/:id', getPostProcurementById)



export default router
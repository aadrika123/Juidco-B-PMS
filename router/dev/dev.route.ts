import express from "express";
const router = express.Router()
import devAuth from "../../middleware/devAuth";
import { makeStockReceived } from "../../controller/dev/dev.controller";

router.use(devAuth)

router.post('/make-stock-received', makeStockReceived)


export default router
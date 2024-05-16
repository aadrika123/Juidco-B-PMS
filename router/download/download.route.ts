import express from "express";
const router = express.Router()
import { exportCsv } from "../../controller/download/download.controller";


router.post('/', exportCsv)


export default router
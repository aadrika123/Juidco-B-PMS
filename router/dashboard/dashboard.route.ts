import express from "express";
const router = express.Router()
import { getIaDashboard } from "../../controller/dashboard/iaDashboard.controller";
import { getDistDashboard } from "../../controller/dashboard/distDashboard.controller";


router.get('/ia/', getIaDashboard)
router.get('/dd/', getDistDashboard)

export default router
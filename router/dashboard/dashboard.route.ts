import express from "express";
const router = express.Router()
import { getIaDashboard } from "../../controller/dashboard/iaDashboard.controller";
import { getDistDashboard } from "../../controller/dashboard/distDashboard.controller";
import { getLevelDashboard } from "../../controller/dashboard/levelDashboard.controller";


router.get('/ia/', getIaDashboard)
router.get('/dd/', getDistDashboard)
router.get('/level/', getLevelDashboard)

export default router
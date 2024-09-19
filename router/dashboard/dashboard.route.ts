import express from "express";
const router = express.Router()
import { getIaDashboard } from "../../controller/dashboard/iaDashboard.controller";
import { getDistDashboard } from "../../controller/dashboard/distDashboard.controller";
import { getLevelDashboard } from "../../controller/dashboard/levelDashboard.controller";
import { getTenderDashboard } from "../../controller/dashboard/tenderDashboard.controller";


router.get('/ia/', getIaDashboard)
router.get('/dd/', getDistDashboard)
router.get('/level/', getLevelDashboard)
router.get('/tender/', getTenderDashboard)

export default router
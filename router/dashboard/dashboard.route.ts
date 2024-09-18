import express from "express";
const router = express.Router()
import { getDistDashboard } from "../../controller/dashboard/distDashboard.controller";


router.get('/dd/', getDistDashboard)

export default router
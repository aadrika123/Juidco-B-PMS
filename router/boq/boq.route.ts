import express from "express";
const router = express.Router()
import {
    getBoqByRefNo
} from "../../controller/boq/boq.controller";


router.get('/by-ref/:reference_no', getBoqByRefNo)


export default router
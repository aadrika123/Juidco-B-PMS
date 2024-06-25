import express from "express";
const router = express.Router()
import {
    getBoqByRefNo,
    editBoq
} from "../../controller/boq/boq.controller";
import { upload } from "../../config/multer.config";


router.get('/by-ref/:reference_no', getBoqByRefNo)
router.post('/edit', upload.array('img'), editBoq)


export default router
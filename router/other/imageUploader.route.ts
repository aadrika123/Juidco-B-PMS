import express from "express";
const router = express.Router()
import { upload } from "../../config/multer.config";
import { uploadGetUrl } from "../../controller/other/upload.controller";


router.post('/upload', upload.array('doc'), uploadGetUrl)


export default router
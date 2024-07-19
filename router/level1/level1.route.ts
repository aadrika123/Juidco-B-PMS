import express from "express";
const router = express.Router()
import {
    getBoqInbox,
    getBoqOutbox,
    rejectionByLevel1,
    returnToDa,
    approvalByLevel1,
    forwardToLevel2
} from "../../controller/level1/level1.controller";


router.get('/', getBoqInbox)
router.get('/outbox', getBoqOutbox)
router.post('/reject', rejectionByLevel1)
router.post('/return', returnToDa)
router.post('/approve', approvalByLevel1)
router.post('/to-level2', forwardToLevel2)


export default router
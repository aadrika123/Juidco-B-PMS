import express from 'express'
const router = express.Router()
import { getInbox, getOutbox, rejectionByLevel1, returnToDa, approvalByLevel1, forwardToLevel2 } from '../../controller/level1/level1.controller'

router.get('/', getInbox)
router.get('/outbox', getOutbox)
router.post('/reject', rejectionByLevel1)
router.post('/return', returnToDa)
router.post('/approve', approvalByLevel1)
router.post('/to-level2', forwardToLevel2)

export default router

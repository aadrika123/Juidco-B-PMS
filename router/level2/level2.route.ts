import express from 'express'
const router = express.Router()
import { getInbox, getOutbox, rejectionByLevel2, returnToLevel1, approvalByLevel2 } from '../../controller/level2/level2.controller'

router.get('/', getInbox)
router.get('/outbox', getOutbox)
router.post('/reject', rejectionByLevel2)
router.post('/return', returnToLevel1)
router.post('/approve', approvalByLevel2)

export default router

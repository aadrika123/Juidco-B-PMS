import express from 'express'
const router = express.Router()
import { getBoqByRefNo, getBoqInbox, getBoqOutbox, approveBoq } from '../../controller/finance/finance.controller'

router.get('/boq/', getBoqInbox)
router.get('/boq/outbox', getBoqOutbox)
router.get('/boq/:reference_no', getBoqByRefNo)
router.post('/boq/approve', approveBoq)
router.post('/boq/reject', approveBoq)

export default router

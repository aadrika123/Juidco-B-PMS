import express from 'express'
const router = express.Router()
import { getProcurementByProcurementNo, editProcurement } from '../../controller/procurement/procurement.controller'

router.post('/', editProcurement)
router.get('/:procurement_no', getProcurementByProcurementNo)

export default router

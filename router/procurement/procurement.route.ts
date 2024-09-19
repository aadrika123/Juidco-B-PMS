import express from 'express'
const router = express.Router()
import { getProcurementByProcurementNo, editProcurement, getInventoryAdditionValidityNo, editProcurementStock } from '../../controller/procurement/procurement.controller'

router.post('/', editProcurement)
router.post('/edit/stock', editProcurementStock)
router.get('/addition-validity/:procurement_stock_id', getInventoryAdditionValidityNo)
router.get('/:procurement_no', getProcurementByProcurementNo)

export default router

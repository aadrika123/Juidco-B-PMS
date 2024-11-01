import express from 'express'
const router = express.Router()
import { createItem, getItem, getItemByFilter, getItemBySubcategoryBrand, getQuantityByItemId, getItemById } from '../../controller/inventory/inventory.controller'

router.post('/', createItem)
router.get('/', getItem)
router.get('/:id', getItemById)
router.get('/by-filter', getItemByFilter)
router.post('/by-subcategory-brand', getItemBySubcategoryBrand)
router.get('/total-available/:id', getQuantityByItemId)

export default router

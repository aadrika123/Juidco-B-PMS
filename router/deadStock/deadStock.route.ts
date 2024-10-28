import express from 'express'
const router = express.Router()
import { getItem, retrieveItem } from '../../controller/deadStock/deadStock.controller'

router.get('/', getItem)
router.post('/retrieve', retrieveItem)

export default router

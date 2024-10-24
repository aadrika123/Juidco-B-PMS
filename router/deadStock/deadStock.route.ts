import express from 'express'
const router = express.Router()
import { getItem } from '../../controller/deadStock/deadStock.controller'

router.get('/', getItem)

export default router

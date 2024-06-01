import express from "express";
const router = express.Router()
import {
    createItem,
    getItem,
    getItemByFilter
} from "../../controller/inventory/inventory.controller";


router.post('/', createItem)
router.get('/', getItem)
router.get('/by-filter', getItemByFilter)


export default router
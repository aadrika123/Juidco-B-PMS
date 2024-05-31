import express from "express";
const router = express.Router()
import {
    createItem,
    getItem
} from "../../controller/inventory/inventory.controller";


router.post('/', createItem)
router.get('/', getItem)


export default router
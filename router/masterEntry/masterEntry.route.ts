import express from "express";
const router = express.Router()
import { createSubCategory, getSubcategory, getSubcategoryByCategoryId } from './../../controller/masterEntry/subcategory.controller';
import { createCategory, getCategory, getCategoryById } from "../../controller/masterEntry/category.controller";
import { createBrand, getBrand } from "../../controller/masterEntry/brand.controller";
import { createProcessor, getProcessor } from "../../controller/masterEntry/processor.controller";
import { createRam, getRam } from "../../controller/masterEntry/ram.controller";
import { createOs, getOs } from "../../controller/masterEntry/os.controller";
import { createRom, getRom } from "../../controller/masterEntry/rom.controller";
import { createGraphics, getGraphics } from "../../controller/masterEntry/graphics.controller";
import { createItem, getItem, getItemyById } from "../../controller/masterEntry/item.controller";

//sub-category
router.post('/sub-category', createSubCategory)
router.get('/sub-category', getSubcategory)
router.get('/sub-category/by-category/:categoryId', getSubcategoryByCategoryId)

//category
router.post('/category', createCategory)
router.get('/category', getCategory)
router.get('/category/:id', getCategoryById)

//Brand
router.post('/brand', createBrand)
router.get('/brand', getBrand)

//Processor
router.post('/processor', createProcessor)
router.get('/processor', getProcessor)

//Ram
router.post('/ram', createRam)
router.get('/ram', getRam)

//Ram
router.post('/os', createOs)
router.get('/os', getOs)

//ROM
router.post('/rom', createRom)
router.get('/rom', getRom)

//Graphics
router.post('/graphics', createGraphics)
router.get('/graphics', getGraphics)

//Item
router.post('/item', createItem)
router.get('/item', getItem)
router.get('/item/:id', getItemyById)


export default router
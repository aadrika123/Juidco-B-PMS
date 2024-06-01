import express from "express";
const router = express.Router()
import { createSubCategory, getSubcategory, getSubcategoryByCategoryId } from './../../controller/masterEntry/subcategory.controller';
import { createCategory, getCategory, getCategoryById } from "../../controller/masterEntry/category.controller";
import { createBrand, getBrand, getBrandBySubcategoryId } from "../../controller/masterEntry/brand.controller";

//sub-category
router.post('/sub-category', createSubCategory)
router.get('/sub-category', getSubcategory)
router.get('/sub-category/by-category/:categoryId', getSubcategoryByCategoryId)

//category
router.post('/category', createCategory)
router.get('/category', getCategory)
router.get('/category/:id', getCategoryById)

//Brand
router.get('brand/by-subcategory/:subcategoryId', getBrandBySubcategoryId)
router.post('/brand', createBrand)
router.get('/brand', getBrand)
// router.get('/brand/by-subcategory/:subcategoryId', getBrandBySubcategoryId)


export default router
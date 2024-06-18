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
router.get('/by-subcategory/:subcategoryId', getBrandBySubcategoryId)  //I had to remove '/brand' which was more suitable but for some reason it was not working on staging server(https://aadrikainfomedia.com/auth) but was working fine on local server.
router.post('/brand', createBrand)
router.get('/brand', getBrand)
// router.get('/brand/by-subcategory/:subcategoryId', getBrandBySubcategoryId)


export default router
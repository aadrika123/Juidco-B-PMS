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

/**
 * @swagger
 * /api/pms/master/category:
 *   post:
 *     summary: Create category.
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The category name.
 *                 example: Technology
 *     responses:
 *       201:
 *         description: Category created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
*/
router.post('/category', createCategory)


/**
 * @swagger
 * /api/pms/master/category:
 *   get:
 *     summary: Get category list
 *     description: Retrieve a list of categories.
 *     tags:
 *       - Category
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The category ID.
 *                         example: cd69968c-b3f7-422c-8309-2bbc33523f18
 *                       name:
 *                         type: string
 *                         description: name of the category.
 *                         example: Technology
 *                       createdAt:
 *                         type: date
 *                         description: The time of creation.
 *                         example: 2024-06-07T17:29:33.801Z
 *                       updatedAt:
 *                         type: date
 *                         description: The time of update.
 *                         example: 2024-06-07T17:29:33.801Z
 *
*/
router.get('/category', getCategory)
router.get('/category/:id', getCategoryById)

//Brand
router.get('/by-subcategory/:subcategoryId', getBrandBySubcategoryId)
router.post('/brand', createBrand)
router.get('/brand', getBrand)
// router.get('/brand/by-subcategory/:subcategoryId', getBrandBySubcategoryId)


export default router
import express from 'express'
const router = express.Router()
import { createSubCategory, getSubcategory, getSubcategoryByCategoryId, getSubcategoryActiveOnly, editSubcategory, switchStatus as subSwitch, getSubcategoryByCategoryIdActiveOnly, getSubcategoryById } from './../../controller/masterEntry/subcategory.controller'
import { createCategory, getCategory, getCategoryById, editCategory, switchStatus, getCategoryActiveOnly, getCategoryActiveOnlyById } from '../../controller/masterEntry/category.controller'
import { createBrand, getBrand, getBrandBySubcategoryId, getBrandActiveOnly, getBrandBySubcategoryIdActiveOnly, editBrand, switchStatus as brandSwitch, getBrandById } from '../../controller/masterEntry/brand.controller'
import { createUnit, getUnit, getUnitById, editUnit, switchStatus as unitSwitch, getUnitActiveOnly } from '../../controller/masterEntry/unit.controller'
import { createSupplier, getSupplier, getSupplierById, editSupplier, switchStatus as supplierSwitch, getSupplierActiveOnly, getSupplierByProcurementNo } from '../../controller/masterEntry/supplier.controller'
import { createBank, getBank, getBankById, editBank, switchStatus as bankSwitch, getBankActiveOnly } from '../../controller/masterEntry/bank.controller'


//sub-category
router.post('/sub-category', createSubCategory)
router.get('/sub-category', getSubcategory)
router.get('/sub-category/active', getSubcategoryActiveOnly)
router.post('/sub-category/update', editSubcategory)
router.post('/sub-category/switch', subSwitch)
router.get('/sub-category/by-category/:categoryId', getSubcategoryByCategoryId)
router.get('/sub-category/by-category/active/:categoryId', getSubcategoryByCategoryIdActiveOnly)
router.get('/sub-category/:id', getSubcategoryById)

//category
router.post('/category', createCategory)
router.get('/category', getCategory)
router.get('/category/active', getCategoryActiveOnly)
router.get('/category/active/:id', getCategoryActiveOnlyById)
router.post('/category/update', editCategory)
router.post('/category/switch', switchStatus)
router.get('/category/:id', getCategoryActiveOnlyById)

//Brand
router.get('/by-subcategory/:subcategoryId', getBrandBySubcategoryId) //I had to remove '/brand' which was more suitable but for some reason it was not working on staging server(https://aadrikainfomedia.com/auth) but was working fine on local server.
router.get('/by-subcategory/active/:subcategoryId', getBrandBySubcategoryIdActiveOnly)
router.post('/brand', createBrand)
router.get('/brand', getBrand)
router.get('/brand/active', getBrandActiveOnly)
router.post('/brand/update', editBrand)
router.post('/brand/switch', brandSwitch)
router.get('/brand/:id', getBrandById)
// router.get('/brand/by-subcategory/:subcategoryId', getBrandBySubcategoryId)

//unit
router.post('/unit', createUnit)
router.get('/unit', getUnit)
router.get('/unit/active', getUnitActiveOnly)
router.post('/unit/update', editUnit)
router.post('/unit/switch', unitSwitch)
router.get('/unit/:id', getUnitById)

//supplier
router.post('/supplier', createSupplier)
router.get('/supplier', getSupplier)
router.get('/supplier/active', getSupplierActiveOnly)
router.post('/supplier/update', editSupplier)
router.post('/supplier/switch', supplierSwitch)
router.get('/supplier/by-procurement/:procurement_no', getSupplierByProcurementNo)
router.get('/supplier/:id', getSupplierById)

//bank
router.post('/bank', createBank)
router.get('/bank', getBank)
router.get('/bank/active', getBankActiveOnly)
router.post('/bank/update', editBank)
router.post('/bank/switch', bankSwitch)
router.get('/bank/:id', getBankById)


export default router

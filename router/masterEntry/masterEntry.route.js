"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const subcategory_controller_1 = require("./../../controller/masterEntry/subcategory.controller");
const category_controller_1 = require("../../controller/masterEntry/category.controller");
const brand_controller_1 = require("../../controller/masterEntry/brand.controller");
const processor_controller_1 = require("../../controller/masterEntry/processor.controller");
const ram_controller_1 = require("../../controller/masterEntry/ram.controller");
const os_controller_1 = require("../../controller/masterEntry/os.controller");
const rom_controller_1 = require("../../controller/masterEntry/rom.controller");
const graphics_controller_1 = require("../../controller/masterEntry/graphics.controller");
const item_controller_1 = require("../../controller/masterEntry/item.controller");
//sub-category
router.post('/sub-category', subcategory_controller_1.createSubCategory);
router.get('/sub-category', subcategory_controller_1.getSubcategory);
router.get('/sub-category/by-category/:categoryId', subcategory_controller_1.getSubcategoryByCategoryId);
//category
router.post('/category', category_controller_1.createCategory);
router.get('/category', category_controller_1.getCategory);
router.get('/category/:id', category_controller_1.getCategoryById);
//Brand
router.post('/brand', brand_controller_1.createBrand);
router.get('/brand', brand_controller_1.getBrand);
//Processor
router.post('/processor', processor_controller_1.createProcessor);
router.get('/processor', processor_controller_1.getProcessor);
//Ram
router.post('/ram', ram_controller_1.createRam);
router.get('/ram', ram_controller_1.getRam);
//Ram
router.post('/os', os_controller_1.createOs);
router.get('/os', os_controller_1.getOs);
//ROM
router.post('/rom', rom_controller_1.createRom);
router.get('/rom', rom_controller_1.getRom);
//Graphics
router.post('/graphics', graphics_controller_1.createGraphics);
router.get('/graphics', graphics_controller_1.getGraphics);
//Item
router.post('/item', item_controller_1.createItem);
router.get('/item', item_controller_1.getItem);
router.get('/item/:id', item_controller_1.getItemyById);
exports.default = router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubcategoryByCategoryId = exports.getSubcategory = exports.createSubCategory = void 0;
const subcategory_dal_1 = require("../../dal/masterEntry/subcategory.dal");
const createSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, subcategory_dal_1.createSubcategoryDal)(req);
    if (!(result === null || result === void 0 ? void 0 : result.error)) {
        res.status(201).json({
            status: true,
            message: `Sub category created having id : ${result.id}`
        });
    }
    else {
        res.status(400).json({
            status: false,
            message: `Subcategory creation failed`,
            error: result === null || result === void 0 ? void 0 : result.message
        });
    }
});
exports.createSubCategory = createSubCategory;
const getSubcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, subcategory_dal_1.getSubcategoryDal)(req);
    if (!(result === null || result === void 0 ? void 0 : result.error)) {
        res.status(200).json({
            status: true,
            message: `Subcategory list fetched successfully`,
            data: result
        });
    }
    else {
        res.status(404).json({
            status: false,
            message: `Error while fetching subcategory list`,
            error: result === null || result === void 0 ? void 0 : result.message
        });
    }
});
exports.getSubcategory = getSubcategory;
const getSubcategoryByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, subcategory_dal_1.getSubcategoryByCategoryIdDal)(req);
    if (!(result === null || result === void 0 ? void 0 : result.error)) {
        res.status(200).json({
            status: true,
            message: `Subcategory fetched successfully`,
            data: result
        });
    }
    else {
        res.status(404).json({
            status: false,
            message: `Error while fetching subcategory`,
            error: result === null || result === void 0 ? void 0 : result.message
        });
    }
});
exports.getSubcategoryByCategoryId = getSubcategoryByCategoryId;

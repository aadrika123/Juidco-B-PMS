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
exports.getBrand = exports.createBrand = void 0;
const brand_dal_1 = require("../../dal/masterEntry/brand.dal");
const createBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, brand_dal_1.createBrandDal)(req);
    if (!(result === null || result === void 0 ? void 0 : result.error)) {
        res.status(201).json({
            status: true,
            message: `Brand created having id : ${result.id}`
        });
    }
    else {
        res.status(400).json({
            status: false,
            message: `Brand creation failed`,
            error: result === null || result === void 0 ? void 0 : result.message
        });
    }
});
exports.createBrand = createBrand;
const getBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, brand_dal_1.getBrandDal)(req);
    if (!(result === null || result === void 0 ? void 0 : result.error)) {
        res.status(200).json({
            status: true,
            message: `Brand list fetched successfully`,
            data: result
        });
    }
    else {
        res.status(404).json({
            status: false,
            message: `Error while fetching brand list`,
            error: result === null || result === void 0 ? void 0 : result.message
        });
    }
});
exports.getBrand = getBrand;

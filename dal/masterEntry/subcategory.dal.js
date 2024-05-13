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
exports.getSubcategoryByCategoryIdDal = exports.getSubcategoryDal = exports.createSubcategoryDal = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSubcategoryDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category_masterId } = req.body;
    const data = {
        name: name,
        category_masterId: category_masterId
    };
    try {
        const result = prisma.subcategory_master.create({
            data: data
        });
        return result;
    }
    catch (err) {
        console.log(err === null || err === void 0 ? void 0 : err.message);
        return { error: true, message: err === null || err === void 0 ? void 0 : err.message };
    }
});
exports.createSubcategoryDal = createSubcategoryDal;
const getSubcategoryDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma.subcategory_master.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                category: true
            }
        });
        return result;
    }
    catch (err) {
        console.log(err === null || err === void 0 ? void 0 : err.message);
        return { error: true, message: err === null || err === void 0 ? void 0 : err.message };
    }
});
exports.getSubcategoryDal = getSubcategoryDal;
const getSubcategoryByCategoryIdDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        const result = yield prisma.subcategory_master.findFirst({
            where: {
                category_masterId: categoryId
            }
        });
        return result;
    }
    catch (err) {
        console.log(err === null || err === void 0 ? void 0 : err.message);
        return { error: true, message: err === null || err === void 0 ? void 0 : err.message };
    }
});
exports.getSubcategoryByCategoryIdDal = getSubcategoryByCategoryIdDal;

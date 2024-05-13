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
exports.getRomDal = exports.createRomDal = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createRomDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { capacity, type } = req.body;
    const data = {
        capacity: capacity,
        type: type
    };
    try {
        const result = yield prisma.rom_master.create({
            data: data
        });
        return result;
    }
    catch (err) {
        console.log(err === null || err === void 0 ? void 0 : err.message);
        return { error: true, message: err === null || err === void 0 ? void 0 : err.message };
    }
});
exports.createRomDal = createRomDal;
const getRomDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma.rom_master.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return result;
    }
    catch (err) {
        console.log(err === null || err === void 0 ? void 0 : err.message);
        return { error: true, message: err === null || err === void 0 ? void 0 : err.message };
    }
});
exports.getRomDal = getRomDal;

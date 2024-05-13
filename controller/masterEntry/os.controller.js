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
exports.getOs = exports.createOs = void 0;
const os_dal_1 = require("../../dal/masterEntry/os.dal");
const createOs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, os_dal_1.createOsDal)(req);
    if (!(result === null || result === void 0 ? void 0 : result.error)) {
        res.status(201).json({
            status: true,
            message: `OS created having id : ${result.id}`
        });
    }
    else {
        res.status(400).json({
            status: false,
            message: `OS creation failed`,
            error: result === null || result === void 0 ? void 0 : result.message
        });
    }
});
exports.createOs = createOs;
const getOs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, os_dal_1.getOsDal)(req);
    if (!(result === null || result === void 0 ? void 0 : result.error)) {
        res.status(200).json({
            status: true,
            message: `OS list fetched successfully`,
            data: result
        });
    }
    else {
        res.status(404).json({
            status: false,
            message: `Error while fetching OS list`,
            error: result === null || result === void 0 ? void 0 : result.message
        });
    }
});
exports.getOs = getOs;

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
exports.getPreProcurementByOrderNo = exports.getPreProcurementById = exports.getPreProcurement = exports.createPreProcurement = void 0;
const preProcurement_dal_1 = require("../../dal/stockReceiver/preProcurement.dal");
const createPreProcurement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, preProcurement_dal_1.createPreProcurementDal)(req);
    if (!(result === null || result === void 0 ? void 0 : result.error)) {
        res.status(201).json({
            status: true,
            message: `Pre procurement created having id : ${result.id}`,
            order_no: result === null || result === void 0 ? void 0 : result.order_no
        });
    }
    else {
        res.status(400).json({
            status: false,
            message: `Pre procurement creation failed`,
            error: result === null || result === void 0 ? void 0 : result.message
        });
    }
});
exports.createPreProcurement = createPreProcurement;
const getPreProcurement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, preProcurement_dal_1.getPreProcurementDal)(req);
    if (!(result === null || result === void 0 ? void 0 : result.error)) {
        res.status(200).json({
            status: true,
            message: `Pre procurement list fetched successfully`,
            data: result === null || result === void 0 ? void 0 : result.data,
            pagination: result === null || result === void 0 ? void 0 : result.pagination
        });
    }
    else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement list`,
            error: result === null || result === void 0 ? void 0 : result.message
        });
    }
});
exports.getPreProcurement = getPreProcurement;
const getPreProcurementById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, preProcurement_dal_1.getPreProcurementByIdDal)(req);
    if (!(result === null || result === void 0 ? void 0 : result.error)) {
        res.status(200).json({
            status: true,
            message: `Pre procurement fetched successfully`,
            data: result
        });
    }
    else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement`,
            error: result === null || result === void 0 ? void 0 : result.message
        });
    }
});
exports.getPreProcurementById = getPreProcurementById;
const getPreProcurementByOrderNo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, preProcurement_dal_1.getPreProcurementByOrderNoDal)(req);
    if (!(result === null || result === void 0 ? void 0 : result.error)) {
        res.status(200).json({
            status: true,
            message: `Pre procurement fetched successfully`,
            data: result
        });
    }
    else {
        res.status(404).json({
            status: false,
            message: `Error while fetching Pre procurement`,
            error: result === null || result === void 0 ? void 0 : result.message
        });
    }
});
exports.getPreProcurementByOrderNo = getPreProcurementByOrderNo;

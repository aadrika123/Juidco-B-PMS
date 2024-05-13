"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const srPreProcurement_controller_1 = require("../../../controller/stockReceiver/srPreProcurement.controller");
router.post('/pre-procurement', srPreProcurement_controller_1.createPreProcurement);
router.get('/pre-procurement', srPreProcurement_controller_1.getPreProcurement);
router.get('/pre-procurement/:id', srPreProcurement_controller_1.getPreProcurementById);
router.get('/pre-procurement/by-order-no/:order_no', srPreProcurement_controller_1.getPreProcurementByOrderNo);
router.post('/pre-procurement/to-da', srPreProcurement_controller_1.createPreProcurement);
exports.default = router;

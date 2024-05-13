"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const masterEntry_route_1 = __importDefault(require("./router/masterEntry/masterEntry.route"));
const srPreProcurement_route_1 = __importDefault(require("./router/stockReciever/preProcurement/srPreProcurement.route"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 6969;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Procurement and Inventory Management System backend');
});
//routes
app.use('/api/master', masterEntry_route_1.default);
app.use('/api/sr', srPreProcurement_route_1.default);
app.listen(port, () => {
    console.log(`Procurement and Inventory Management System is listening on port ${port}`);
});

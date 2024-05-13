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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreProcurementByOrderNoDal = exports.getPreProcurementByIdDal = exports.getPreProcurementDal = exports.createPreProcurementDal = void 0;
const client_1 = require("@prisma/client");
const orderNumberGenerator_1 = __importDefault(require("../../lib/orderNumberGenerator"));
const prisma = new client_1.PrismaClient();
const createPreProcurementDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let order_no;
    const { name, category, subcategory, brand, processor, ram, os, rom, graphics, other_description, rate, quantity, total_rate } = req.body;
    order_no = (0, orderNumberGenerator_1.default)();
    if (order_no) {
        try {
            const existance = yield prisma.sr_pre_procurement_inbox.count({
                where: {
                    order_no: order_no
                }
            });
            if (existance) {
                order_no = (0, orderNumberGenerator_1.default)();
            }
        }
        catch (err) {
            console.log(err === null || err === void 0 ? void 0 : err.message);
        }
    }
    const data = {
        category: { connect: { id: category } },
        subcategory: { connect: { id: subcategory } },
        brand: { connect: { id: brand } },
        processor: { connect: { id: processor } },
        ram: { connect: { id: ram } },
        os: { connect: { id: os } },
        rom: { connect: { id: rom } },
        graphics: { connect: { id: graphics } },
        other_description: other_description,
        order_no: order_no,
        rate: Number(rate),
        quantity: Number(quantity),
        total_rate: Number(total_rate),
        status: {
            create: {
                order_no: order_no,
                status: 0
            }
        }
    };
    if (Number(rate) && Number(quantity)) {
        if (Number(rate) * Number(quantity) !== Number(total_rate)) {
            return { error: true, message: "The calculation result for total rate is invalid" };
        }
    }
    try {
        const result = yield prisma.sr_pre_procurement_inbox.create({
            data: data
        });
        return result;
    }
    catch (err) {
        console.log(err === null || err === void 0 ? void 0 : err.message);
        return { error: true, message: err === null || err === void 0 ? void 0 : err.message };
    }
});
exports.createPreProcurementDal = createPreProcurementDal;
const getPreProcurementDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const page = Number((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.page);
    const take = Number((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.take);
    const startIndex = (page - 1) * take;
    const endIndex = startIndex + take;
    let count;
    let totalPage;
    let pagination = {};
    const whereClause = {};
    const search = ((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.search) ? String((_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.search) : '';
    const category = Array.isArray((_e = req === null || req === void 0 ? void 0 : req.query) === null || _e === void 0 ? void 0 : _e.category) ? (_f = req === null || req === void 0 ? void 0 : req.query) === null || _f === void 0 ? void 0 : _f.category : [(_g = req === null || req === void 0 ? void 0 : req.query) === null || _g === void 0 ? void 0 : _g.category];
    const subcategory = Array.isArray((_h = req === null || req === void 0 ? void 0 : req.query) === null || _h === void 0 ? void 0 : _h.scategory) ? (_j = req === null || req === void 0 ? void 0 : req.query) === null || _j === void 0 ? void 0 : _j.scategory : [(_k = req === null || req === void 0 ? void 0 : req.query) === null || _k === void 0 ? void 0 : _k.scategory];
    const brand = Array.isArray((_l = req === null || req === void 0 ? void 0 : req.query) === null || _l === void 0 ? void 0 : _l.brand) ? (_m = req === null || req === void 0 ? void 0 : req.query) === null || _m === void 0 ? void 0 : _m.brand : [(_o = req === null || req === void 0 ? void 0 : req.query) === null || _o === void 0 ? void 0 : _o.brand];
    whereClause.OR = [
        {
            order_no: {
                contains: search,
                mode: 'insensitive'
            }
        },
        {
            other_description: {
                contains: search,
                mode: 'insensitive'
            }
        }
    ];
    if (category[0]) {
        whereClause.category_masterId = {
            in: category
        };
    }
    if (subcategory[0]) {
        whereClause.subcategory_masterId = {
            in: subcategory
        };
    }
    if (brand[0]) {
        whereClause.brand_masterId = {
            in: brand
        };
    }
    try {
        count = yield prisma.sr_pre_procurement_inbox.count({
            where: whereClause
        });
        const result = yield prisma.sr_pre_procurement_inbox.findMany(Object.assign(Object.assign(Object.assign({ orderBy: {
                createdAt: 'desc'
            }, where: whereClause }, (page && { skip: startIndex })), (take && { take: take })), { select: {
                id: true,
                order_no: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                subcategory: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                processor: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                ram: {
                    select: {
                        id: true,
                        capacity: true
                    }
                },
                os: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                rom: {
                    select: {
                        id: true,
                        capacity: true,
                        type: true
                    }
                },
                graphics: {
                    select: {
                        id: true,
                        name: true,
                        vram: true
                    }
                },
                other_description: true,
                rate: true,
                quantity: true,
                status: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            } }));
        totalPage = Math.ceil(count / take);
        if (endIndex < count) {
            pagination.next = {
                page: page + 1,
                take: take
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                take: take
            };
        }
        pagination.currentPage = page;
        pagination.currentTake = take;
        pagination.totalPage = totalPage;
        return {
            data: result,
            pagination: pagination
        };
    }
    catch (err) {
        console.log(err === null || err === void 0 ? void 0 : err.message);
        return { error: true, message: err === null || err === void 0 ? void 0 : err.message };
    }
});
exports.getPreProcurementDal = getPreProcurementDal;
const getPreProcurementByIdDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield prisma.sr_pre_procurement_inbox.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                order_no: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                subcategory: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                processor: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                ram: {
                    select: {
                        id: true,
                        capacity: true
                    }
                },
                os: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                rom: {
                    select: {
                        id: true,
                        capacity: true,
                        type: true
                    }
                },
                graphics: {
                    select: {
                        id: true,
                        name: true,
                        vram: true
                    }
                },
                other_description: true,
                rate: true,
                quantity: true,
                status: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            }
        });
        return result;
    }
    catch (err) {
        console.log(err === null || err === void 0 ? void 0 : err.message);
        return { error: true, message: err === null || err === void 0 ? void 0 : err.message };
    }
});
exports.getPreProcurementByIdDal = getPreProcurementByIdDal;
const getPreProcurementByOrderNoDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_no } = req.params;
    try {
        const result = yield prisma.sr_pre_procurement_inbox.findFirst({
            where: {
                order_no: order_no
            },
            select: {
                id: true,
                order_no: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                subcategory: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                processor: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                ram: {
                    select: {
                        id: true,
                        capacity: true
                    }
                },
                os: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                rom: {
                    select: {
                        id: true,
                        capacity: true,
                        type: true
                    }
                },
                graphics: {
                    select: {
                        id: true,
                        name: true,
                        vram: true
                    }
                },
                other_description: true,
                rate: true,
                quantity: true,
                status: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            }
        });
        return result;
    }
    catch (err) {
        console.log(err === null || err === void 0 ? void 0 : err.message);
        return { error: true, message: err === null || err === void 0 ? void 0 : err.message };
    }
});
exports.getPreProcurementByOrderNoDal = getPreProcurementByOrderNoDal;
// export const forwardToDa = async (req: Request) => {
//     const { preProcurement }: { preProcurement: string[] } = req.body
//     let srInbox: any
//     try {
//         preProcurement.map(async (item) => {
//             const inbox: any = await prisma.sr_pre_procurement_inbox.findFirst({
//                 where: {
//                     id: item
//                 },
//                 select: {
//                     id: false
//                 }
//             })
//             const transaction = await prisma.$transaction([
//                 prisma.sr_pre_procurement_outbox.create({
//                     data: inbox
//                 }),
//                 prisma.procurement_status.update({
//                 })
//             ])
//         })
//         return
//     } catch (err: any) {
//         console.log(err?.message)
//         return { error: true, message: err?.message }
//     }
// }

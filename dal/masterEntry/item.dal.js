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
exports.getItemByIdDal = exports.getItemDal = exports.createItemDal = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createItemDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, subcategory, brand, processor, ram, os, rom, graphics, other_description } = req.body;
    const data = {
        name: name,
        category_masterId: category,
        subcategory_masterId: subcategory,
        brand_masterId: brand,
        processor_masterId: processor,
        ram_masterId: ram,
        os_masterId: os,
        rom_masterId: rom,
        graphics_masterId: graphics,
        other_description: other_description
    };
    try {
        const result = yield prisma.item_master.create({
            data: data
        });
        return result;
    }
    catch (err) {
        console.log(err === null || err === void 0 ? void 0 : err.message);
        return { error: true, message: err === null || err === void 0 ? void 0 : err.message };
    }
});
exports.createItemDal = createItemDal;
const getItemDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
            name: {
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
        count = yield prisma.item_master.count({
            where: whereClause
        });
        const result = yield prisma.item_master.findMany(Object.assign(Object.assign(Object.assign({ orderBy: {
                createdAt: 'desc'
            }, where: whereClause }, (page && { skip: startIndex })), (take && { take: take })), { select: {
                id: true,
                name: true,
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
                other_description: true
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
exports.getItemDal = getItemDal;
const getItemByIdDal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield prisma.item_master.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
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
                other_description: true
            }
        });
        return result;
    }
    catch (err) {
        console.log(err === null || err === void 0 ? void 0 : err.message);
        return { error: true, message: err === null || err === void 0 ? void 0 : err.message };
    }
});
exports.getItemByIdDal = getItemByIdDal;

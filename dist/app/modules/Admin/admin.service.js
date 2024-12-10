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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteAdminService = exports.deleteAdminService = exports.updateAdminService = exports.getSingleAdminService = exports.getAllAdminsService = void 0;
const client_1 = require("@prisma/client");
const admin_constant_1 = require("./admin.constant");
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const prisma = new client_1.PrismaClient();
const getAllAdminsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder } = query, filterData = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder"]);
    const andConditions = [{ isDeleted: false }];
    //let conditions = {};
    const searchQuery = admin_constant_1.AdminSearchableFields.map((item) => ({
        [item]: {
            contains: query === null || query === void 0 ? void 0 : query.searchTerm,
            mode: "insensitive",
        },
    }));
    const pagination = (0, QueryBuilder_1.calculatePaginationSorting)({ page, limit, sortBy, sortOrder });
    // [
    //     {
    //         name: {
    //             contains: query?.searchTerm,
    //             mode: 'insensitive'
    //         }
    //     },
    //     {
    //         email: {
    //             contains: query?.searchTerm,
    //             mode: 'insensitive'
    //         }
    //     },
    //     {
    //         contactNumber: {
    //             contains: query?.searchTerm,
    //             mode: 'insensitive'
    //         }
    //     }
    // ]
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        andConditions.push({
            OR: searchQuery,
        });
        // conditions = {
        //     OR: [
        //         {
        //             name: {
        //                 contains: query?.searchTerm,
        //                 mode: 'insensitive'
        //             }
        //         },
        //         {
        //             email: {
        //                 contains: query?.searchTerm,
        //                 mode: 'insensitive'
        //             }
        //         },
        //         {
        //             contactNumber: {
        //                 contains: query?.searchTerm,
        //                 mode: 'insensitive'
        //             }
        //         }
        //     ]
        // }
    }
    //filter-condition for specific field
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    // {
    //     "AND": [
    //         {
    //             "email": "evan@gmail.com"
    //         },
    //         {
    //             "name": "Osman Goni"
    //         },
    //         {
    //             "cotactNumber": "01793837035"
    //         }
    //     ]
    // }
    // whereConditions
    const whereConditions = { AND: andConditions };
    // const result = await prisma.admin.findMany({
    //     where: whereConditions,
    //     skip: Number(page-1) * limit || 0,
    //     take: Number(limit) || 10,
    //     orderBy: sortBy && sortOrder ? {
    //         [sortBy]: sortOrder
    //     } : {
    //         createdAt: 'desc'
    //     }
    // });
    const result = yield prisma.admin.findMany({
        where: whereConditions,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
            [pagination.sortBy]: pagination.sortOrder,
        },
    });
    const total = yield prisma.admin.count({
        where: whereConditions,
    });
    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
            total,
        },
        data: result,
    };
});
exports.getAllAdminsService = getAllAdminsService;
const getSingleAdminService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.admin.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    return result;
});
exports.getSingleAdminService = getSingleAdminService;
const updateAdminService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //if id is not exist
    yield prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = yield prisma.admin.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
exports.updateAdminService = updateAdminService;
const deleteAdminService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //if id is not exist
    yield prisma.admin.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01 admin delete
        const adminDeletedData = yield transactionClient.admin.delete({
            where: {
                id,
            },
        });
        //query-02 delete-user
        yield transactionClient.user.delete({
            where: {
                email: adminDeletedData.email,
            },
        });
        return adminDeletedData;
    }));
    return result;
});
exports.deleteAdminService = deleteAdminService;
const softDeleteAdminService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //if id is not exist
    yield prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01-admin-delete
        const adminDeletedData = yield transactionClient.admin.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        //query-02- delete-user
        yield transactionClient.user.update({
            where: {
                email: adminDeletedData.email,
            },
            data: {
                isDeleted: true,
            },
        });
        return adminDeletedData;
    }));
    return result;
});
exports.softDeleteAdminService = softDeleteAdminService;

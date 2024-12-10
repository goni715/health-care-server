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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIconService = exports.deleteSpecialtiesService = exports.getAllSpecialtiesService = exports.createSpecialtiesService = void 0;
const client_1 = require("@prisma/client");
const uploadImageToCloudinary_1 = __importDefault(require("../../utils/uploadImageToCloudinary"));
const specialties_constant_1 = require("./specialties.constant");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const findPublicId_1 = __importDefault(require("../../helper/findPublicId"));
const cloudinary_1 = __importDefault(require("../../helper/cloudinary"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const prisma = new client_1.PrismaClient();
const createSpecialtiesService = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const specialtiesExist = yield prisma.specialties.findUnique({
        where: {
            title: payload.title,
        },
    });
    //check email is already exist
    if (specialtiesExist) {
        throw new Error("This Title is already existed");
    }
    //if there is a file -- upload image to cloudinary
    if (file) {
        const cloudinaryRes = yield (0, uploadImageToCloudinary_1.default)(file === null || file === void 0 ? void 0 : file.path);
        payload.icon = cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url;
    }
    const createdData = yield prisma.specialties.create({
        data: payload,
    });
    return createdData;
});
exports.createSpecialtiesService = createSpecialtiesService;
const getAllSpecialtiesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder } = query, filterData = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder"]);
    let conditions = {};
    const searchQuery = specialties_constant_1.SpecialtiesSearchableFields.map((item) => ({
        [item]: {
            contains: query === null || query === void 0 ? void 0 : query.searchTerm,
            mode: "insensitive",
        },
    }));
    const pagination = (0, QueryBuilder_1.calculatePaginationSorting)({ page, limit, sortBy, sortOrder });
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        conditions.OR = searchQuery;
    }
    const result = yield prisma.specialties.findMany({
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
            [pagination.sortBy]: pagination.sortOrder,
        },
    });
    const total = yield prisma.specialties.count({
        where: conditions,
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
exports.getAllSpecialtiesService = getAllSpecialtiesService;
const deleteSpecialtiesService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //if id is not exist
    const dataExist = yield prisma.specialties.findUnique({
        where: {
            id,
        },
    });
    if (!dataExist) {
        throw new ApiError_1.default(404, "This id does not exist");
    }
    //delete specialities
    yield prisma.specialties.delete({
        where: {
            id,
        },
    });
    return null;
});
exports.deleteSpecialtiesService = deleteSpecialtiesService;
const updateIconService = (file, id) => __awaiter(void 0, void 0, void 0, function* () {
    //check if the file is not exist
    if (!file) {
        throw new ApiError_1.default(400, "File is required");
    }
    const dataExist = yield prisma.specialties.findUnique({
        where: {
            id,
        },
    });
    //if specialties does not exist
    if (!dataExist) {
        throw new ApiError_1.default(404, "This id does not exist");
    }
    //image upload to cloudinary
    const cloudinaryRes = yield (0, uploadImageToCloudinary_1.default)(file === null || file === void 0 ? void 0 : file.path);
    const icon = cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url;
    const updatedData = yield prisma.specialties.update({
        where: {
            id,
        },
        data: {
            icon,
        },
    });
    //delete image from cloudinary
    if (dataExist.icon) {
        const public_id = (0, findPublicId_1.default)(dataExist.icon);
        yield cloudinary_1.default.uploader.destroy(public_id);
    }
    return updatedData;
});
exports.updateIconService = updateIconService;

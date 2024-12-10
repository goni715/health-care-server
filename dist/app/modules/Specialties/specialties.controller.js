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
exports.SpecialtiesController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const specialties_constant_1 = require("./specialties.constant");
const specialties_service_1 = require("./specialties.service");
const createSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, specialties_service_1.createSpecialtiesService)(req.file, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Specialties created successfully",
        data: result
    });
}));
const getAllSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, specialties_constant_1.SpecialtiesValidFields);
    const result = yield (0, specialties_service_1.getAllSpecialtiesService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Specialties are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const deleteSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, specialties_service_1.deleteSpecialtiesService)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Specialties deleted successfully",
        data: result
    });
}));
const updateIcon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, specialties_service_1.updateIconService)(req.file, id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Icon is updated successfully",
        data: result,
    });
}));
exports.SpecialtiesController = {
    createSpecialties,
    getAllSpecialties,
    deleteSpecialties,
    updateIcon
};

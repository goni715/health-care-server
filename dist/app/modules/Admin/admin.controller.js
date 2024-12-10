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
exports.adminController = void 0;
const admin_service_1 = require("./admin.service");
const admin_constant_1 = require("./admin.constant");
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const getAllAdmins = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, admin_constant_1.AdminValidFields);
    const result = yield (0, admin_service_1.getAllAdminsService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admins are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getSingleAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, admin_service_1.getSingleAdminService)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admin is retrieved successfully",
        data: result,
    });
}));
const updateAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, admin_service_1.updateAdminService)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admin is updated successfully",
        data: result,
    });
}));
const deleteAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield (0, admin_service_1.deleteAdminService)(id);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Admin is deleted successfully",
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
const softDeleteAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield (0, admin_service_1.softDeleteAdminService)(id);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Admin is deleted successfully",
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.adminController = {
    getAllAdmins,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
    softDeleteAdmin
};

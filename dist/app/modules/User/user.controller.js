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
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const user_constant_1 = require("./user.constant");
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, user_service_1.createAdminService)(req.file, req.body);
        res.status(201).json({
            success: true,
            message: "Admin is created successfully",
            data: result
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something Went Wrong',
            error: err
        });
    }
});
const createDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, user_service_1.createDoctorService)(req.file, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Doctor is created successfully",
        data: result
    });
}));
const createPatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, user_service_1.createPatientService)(req.file, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Patient is created successfully",
        data: result
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, user_constant_1.UserValidFields);
    const result = yield (0, user_service_1.getAllUsersService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Users are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const changeStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, user_service_1.changeStatusService)(id, req.body);
    res.status(200).json({
        status: true,
        message: 'Status is updated successfully',
        data: result
    });
}));
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role } = req.headers;
    const result = yield (0, user_service_1.getMyProfileService)(email, role);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My Profile is retrieved successfully",
        data: result,
    });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role } = req.headers;
    const result = yield (0, user_service_1.updateMyProfileService)(email, role, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My Profile is updated successfully",
        data: result,
    });
}));
const updateMyProfilePhoto = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role } = req.headers;
    const result = yield (0, user_service_1.updateMyProfilePhotoService)(req.file, email, role);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My Profile Photo is updated successfully",
        data: result,
    });
}));
exports.UserController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    changeStatus,
    getMyProfile,
    updateMyProfile,
    updateMyProfilePhoto
};

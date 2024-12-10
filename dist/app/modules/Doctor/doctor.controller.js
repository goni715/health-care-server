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
exports.DoctorController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const doctor_constant_1 = require("./doctor.constant");
const doctor_service_1 = require("./doctor.service");
const getAllDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, doctor_constant_1.DoctorValidFields);
    const result = yield (0, doctor_service_1.getAllDoctorsService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctors are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getSingleDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, doctor_service_1.getSingleDoctorService)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctor is retrieved successfully",
        data: result,
    });
}));
const deleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, doctor_service_1.deleteDoctorService)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctor is deleted successfully",
        data: result,
    });
}));
const softDeleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, doctor_service_1.softDeleteDoctorService)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctor is deleted successfully",
        data: result,
    });
}));
const updateDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, doctor_service_1.updateDoctorService)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctor is updated successfully",
        data: result,
    });
}));
const filterDoctorBySpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { specialtiesId } = req.params;
    const result = yield (0, doctor_service_1.filterDoctorBySpecialtiesService)(specialtiesId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctors are retrieved successfully",
        data: result,
    });
}));
exports.DoctorController = {
    getAllDoctors,
    getSingleDoctor,
    deleteDoctor,
    softDeleteDoctor,
    updateDoctor,
    filterDoctorBySpecialties
};

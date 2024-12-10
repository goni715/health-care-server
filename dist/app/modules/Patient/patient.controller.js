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
exports.PatientController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const patient_constant_1 = require("./patient.constant");
const patient_service_1 = require("./patient.service");
const getAllPatients = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, patient_constant_1.PatientValidFields);
    const result = yield (0, patient_service_1.getAllPatientsService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Patients are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getSinglePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, patient_service_1.getSinglePatientService)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Patient is retrieved successfully",
        data: result,
    });
}));
const deletePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, patient_service_1.deletePatientService)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Patient is deleted successfully",
        data: result,
    });
}));
const softDeletePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, patient_service_1.softDeletePatientService)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Patient is deleted successfully.. soft",
        data: result,
    });
}));
const updatePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, patient_service_1.updatePatientService)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Patient is updated successfully",
        data: result,
    });
}));
exports.PatientController = {
    getAllPatients,
    getSinglePatient,
    deletePatient,
    softDeletePatient,
    updatePatient
};

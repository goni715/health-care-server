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
exports.deleteMedicalReportService = exports.createMedicalReportService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const createMedicalReportService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const patientId = payload.patientId;
    const patientExist = yield prisma_1.default.patient.findUnique({
        where: {
            id: patientId
        }
    });
    //check patientId does not exist
    if (!patientExist) {
        throw new ApiError_1.default(404, 'patientId does not exist');
    }
    const result = yield prisma_1.default.medicalReport.create({
        data: payload
    });
    return result;
});
exports.createMedicalReportService = createMedicalReportService;
const deleteMedicalReportService = (patientId, reportId) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield prisma_1.default.patient.findUnique({
        where: {
            id: patientId,
            isDeleted: false,
        },
    });
    //if id is not exist
    if (!patient) {
        throw new ApiError_1.default(404, "patientId does not exist");
    }
    const report = yield prisma_1.default.medicalReport.findUnique({
        where: {
            id: reportId
        },
    });
    //if id is not exist
    if (!report) {
        throw new ApiError_1.default(404, "reportId does not exist");
    }
    const result = yield prisma_1.default.medicalReport.delete({
        where: {
            id: reportId,
            patientId
        }
    });
    return result;
});
exports.deleteMedicalReportService = deleteMedicalReportService;

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
exports.DoctorScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const doctorSchedule_constant_1 = require("./doctorSchedule.constant");
const doctorSchedule_service_1 = require("./doctorSchedule.service");
const createDoctorSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.headers;
    const result = yield (0, doctorSchedule_service_1.createDoctorScheduleService)(email, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Schedules created successfully",
        data: result,
    });
}));
const getMySchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.headers;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, doctorSchedule_constant_1.DoctorScheduleValidFields);
    const result = yield (0, doctorSchedule_service_1.getMySchedulesService)(email, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My Schedules are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getAllDoctorSchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, doctorSchedule_constant_1.DoctorScheduleValidFields);
    const result = yield (0, doctorSchedule_service_1.getAllDoctorSchedulesService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctor Schedules are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const deleteMySchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.headers;
    const { scheduleId } = req.params;
    const result = yield (0, doctorSchedule_service_1.deleteMyScheduleService)(email, scheduleId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My schedule deleted successfully",
        data: result,
    });
}));
exports.DoctorScheduleController = {
    createDoctorSchedule,
    getMySchedules,
    getAllDoctorSchedules,
    deleteMySchedule
};

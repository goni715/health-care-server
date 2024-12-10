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
exports.AppointmentController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const appointment_constant_1 = require("./appointment.constant");
const appointment_service_1 = require("./appointment.service");
const createAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.headers;
    const result = yield (0, appointment_service_1.createAppointmentService)(email, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Appointment Booked successfully",
        data: result,
    });
}));
const getMyAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role } = req.headers;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, appointment_constant_1.AppointmentValidFields);
    const result = yield (0, appointment_service_1.getMyAppointmentService)(email, role, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Appointments are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getAllAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, appointment_constant_1.AppointmentValidFields);
    const result = yield (0, appointment_service_1.getAllAppointmentService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Appointments are retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const changeAppointmentStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const result = yield (0, appointment_service_1.changeAppointmentStatusService)(id, req.body, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Appointment Status is updated successfully",
        data: result,
    });
}));
const changePaymentStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, appointment_service_1.changePaymentStatusService)(id, req.body.status);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Appointment Payment Status updated successfully",
        data: result,
    });
}));
exports.AppointmentController = {
    createAppointment,
    getMyAppointments,
    getAllAppointments,
    changeAppointmentStatus,
    changePaymentStatus,
};

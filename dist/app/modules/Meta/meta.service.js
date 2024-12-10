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
exports.fetchMetaDataService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const fetchMetaDataService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    switch (user === null || user === void 0 ? void 0 : user.role) {
        case client_1.UserRole.super_admin:
            return yield getSuperAdminMetaData();
            break;
        case client_1.UserRole.admin:
            return yield getAdminMetaData();
            break;
        case client_1.UserRole.doctor:
            return yield getDoctorMetaData(user);
            break;
        case client_1.UserRole.patient:
            return yield getPatientMetaData(user);
            break;
        default:
            throw new Error('Something Went Wrong');
    }
});
exports.fetchMetaDataService = fetchMetaDataService;
const getSuperAdminMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentCount = yield prisma_1.default.appointment.count();
    const patientCount = yield prisma_1.default.patient.count();
    const doctorCount = yield prisma_1.default.doctor.count();
    const adminCount = yield prisma_1.default.admin.count();
    const paymentCount = yield prisma_1.default.payment.count();
    const totalRevenue = yield prisma_1.default.payment.aggregate({
        _sum: { amount: true }
    });
    const barChartData = yield getBarChartData();
    const pieCharData = yield getPieChartData();
    return {
        appointmentCount,
        patientCount,
        doctorCount,
        adminCount,
        paymentCount,
        totalRevenue,
        barChartData,
        pieCharData
    };
});
const getAdminMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentCount = yield prisma_1.default.appointment.count();
    const patientCount = yield prisma_1.default.patient.count();
    const doctorCount = yield prisma_1.default.doctor.count();
    const paymentCount = yield prisma_1.default.payment.count();
    const totalRevenue = yield prisma_1.default.payment.aggregate({
        _sum: { amount: true }
    });
    const barChartData = yield getBarChartData();
    const pieCharData = yield getPieChartData();
    return {
        appointmentCount,
        patientCount,
        doctorCount,
        paymentCount,
        totalRevenue,
        barChartData,
        pieCharData
    };
});
const getDoctorMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.default.doctor.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email
        }
    });
    if (!doctorData) {
        throw new ApiError_1.default(404, 'Doctor does not exist');
    }
    const appointmentCount = yield prisma_1.default.appointment.count({
        where: {
            doctorId: doctorData.id
        }
    });
    const patientCount = yield prisma_1.default.appointment.groupBy({
        by: ['patientId'],
        where: {
            doctorId: doctorData.id,
        }
    });
    const reviewCount = yield prisma_1.default.review.count({
        where: {
            doctorId: doctorData.id,
        }
    });
    const totalRevenue = yield prisma_1.default.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appointment: {
                doctorId: doctorData.id
            },
            status: 'PAID'
        }
    });
    const appointmentStatusDistribution = yield prisma_1.default.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            doctorId: doctorData.id
        }
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }));
    return {
        appointmentCount,
        patientCount: patientCount.length,
        reviewCount,
        totalRevenue,
        formattedAppointmentStatusDistribution
    };
});
const getPatientMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield prisma_1.default.patient.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email
        }
    });
    if (!patientData) {
        throw new ApiError_1.default(404, 'patient does not exist');
    }
    const appointmentCount = yield prisma_1.default.appointment.count({
        where: {
            patientId: patientData.id
        }
    });
    const prescriptionCount = yield prisma_1.default.prescription.count({
        where: {
            patientId: patientData.id
        }
    });
    const reviewCount = yield prisma_1.default.review.count({
        where: {
            patientId: patientData.id
        }
    });
    const appointmentStatusDistribution = yield prisma_1.default.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            patientId: patientData.id
        }
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }));
    return {
        appointmentCount,
        prescriptionCount,
        reviewCount,
        formattedAppointmentStatusDistribution
    };
});
const getBarChartData = () => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentCountByMonth = yield prisma_1.default.$queryRaw `
    SELECT DATE_TRUNC('month', "createdAt") AS month,
    CAST(COUNT(*) AS INTEGER) AS count
    FROM "appointments"
    GROUP BY month
    ORDER BY month ASC
    `;
    return appointmentCountByMonth;
});
const getPieChartData = () => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentStatusDistribution = yield prisma_1.default.appointment.groupBy({
        by: ['status'],
        _count: { id: true }
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }));
    return formattedAppointmentStatusDistribution;
});

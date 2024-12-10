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
exports.changePaymentStatusService = exports.cancelUnpaidAppointmentService = exports.changeAppointmentStatusService = exports.getAllAppointmentService = exports.getMyAppointmentService = exports.createAppointmentService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const uuid_1 = require("uuid");
const createAppointmentService = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const patientExist = yield prisma_1.default.patient.findUnique({
        where: {
            email,
        }
    });
    //check if patient does not exist
    if (!patientExist) {
        throw new ApiError_1.default(404, "Patient does not exist");
    }
    //set patientId
    payload.patientId = patientExist.id;
    //set videoCalling
    payload.videoCallingId = (0, uuid_1.v4)();
    const doctorExist = yield prisma_1.default.doctor.findUnique({
        where: {
            id: payload.doctorId,
        },
    });
    // check if doctor does not exist
    if (!doctorExist) {
        throw new ApiError_1.default(404, "doctorId does not exist");
    }
    const scheduleExist = yield prisma_1.default.schedule.findUnique({
        where: {
            id: payload.scheduleId,
        },
    });
    //check if schedule does not exist
    if (!scheduleExist) {
        throw new ApiError_1.default(404, "scheduleId does not exist");
    }
    const doctorScheduleExist = yield prisma_1.default.doctorSchedules.findUnique({
        where: {
            doctorId_scheduleId: {
                doctorId: payload.doctorId,
                scheduleId: payload.scheduleId,
            },
        },
    });
    //check if doctorSchedule does not Exist
    if (!doctorScheduleExist) {
        throw new ApiError_1.default(404, "DoctorSchedule does not exist by the combination of this scheduleId & doctorId");
    }
    //check if doctorSchedule is already booked
    if (doctorScheduleExist.isBooked) {
        throw new ApiError_1.default(403, `This doctorSchedule is already booked`);
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01 createAppointment
        const createdAppointmentData = yield tx.appointment.create({
            data: payload,
        });
        //query-02 update doctorSchedule
        yield tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId,
                },
            },
            data: {
                isBooked: true,
                appointmentId: createdAppointmentData.id,
            },
        });
        //query-03 create payment
        yield tx.payment.create({
            data: {
                appointmentId: createdAppointmentData.id,
                amount: doctorExist.appointmentFee,
                transactionId: (0, uuid_1.v4)(),
            },
        });
        return createdAppointmentData;
    }));
    return result;
});
exports.createAppointmentService = createAppointmentService;
const getMyAppointmentService = (email, role, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder } = query, filters = __rest(query, ["page", "limit", "sortBy", "sortOrder"]);
    let filterQuery = [];
    let includeFields;
    //if role is doctor
    if (role === "doctor") {
        filterQuery.push({
            doctor: {
                email,
            },
        });
        //set patient include fields
        includeFields = {
            patient: {
                include: {
                    patientHealthData: true,
                    medicalReport: true,
                },
            },
            schedule: true,
        };
    }
    //if role is patient
    if (role === "patient") {
        filterQuery.push({
            patient: {
                email,
            },
        });
        //set doctor include fields
        includeFields = {
            doctor: {
                include: {
                    doctorSpecialties: {
                        include: {
                            specialties: true,
                        },
                    },
                },
            },
            schedule: true,
        };
    }
    // Apply additional filters- filter-condition for specific field
    if (Object.keys(filters).length > 0) {
        filterQuery.push(...(0, QueryBuilder_1.makeFilterQuery)(filters));
    }
    // Build the 'where' clause based on search and filter
    const whereConditions = {
        AND: filterQuery,
    };
    // Calculate pagination values & sorting
    const pagination = (0, QueryBuilder_1.calculatePaginationSorting)({
        page,
        limit,
        sortBy,
        sortOrder,
    });
    const result = yield prisma_1.default.appointment.findMany({
        where: whereConditions,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
            [pagination.sortBy]: pagination.sortOrder,
        },
        include: includeFields,
    });
    // Count total with matching the criteria
    const total = yield prisma_1.default.appointment.count({
        where: whereConditions,
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
exports.getMyAppointmentService = getMyAppointmentService;
const getAllAppointmentService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder } = query, filters = __rest(query, ["page", "limit", "sortBy", "sortOrder"]);
    let filterQuery = [];
    // Apply additional filters- filter-condition for specific field
    if (Object.keys(filters).length > 0) {
        filterQuery.push(...(0, QueryBuilder_1.makeFilterQuery)(filters));
    }
    // Build the 'where' clause based on search and filter
    const whereConditions = {
        AND: filterQuery,
    };
    // Calculate pagination values & sorting
    const pagination = (0, QueryBuilder_1.calculatePaginationSorting)({
        page,
        limit,
        sortBy,
        sortOrder,
    });
    const result = yield prisma_1.default.appointment.findMany({
        where: whereConditions,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
            [pagination.sortBy]: pagination.sortOrder,
        },
        include: {
            patient: true,
            doctor: true,
            schedule: true,
        },
    });
    // Count total with matching the criteria
    const total = yield prisma_1.default.appointment.count({
        where: whereConditions,
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
exports.getAllAppointmentService = getAllAppointmentService;
const changeAppointmentStatusService = (appointmentId, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentExist = yield prisma_1.default.appointment.findUnique({
        where: {
            id: appointmentId,
        },
        include: {
            doctor: true,
        },
    });
    //check if appointment does not exist
    if (!appointmentExist) {
        throw new ApiError_1.default(404, "appointmentId does not exist");
    }
    //if user role is doctor
    if ((user === null || user === void 0 ? void 0 : user.role) === "doctor") {
        if (appointmentExist.doctor.email !== (user === null || user === void 0 ? void 0 : user.email)) {
            throw new ApiError_1.default(400, "This is not your appointment");
        }
    }
    const result = yield prisma_1.default.appointment.update({
        where: {
            id: appointmentId,
        },
        data: payload,
    });
    return result;
});
exports.changeAppointmentStatusService = changeAppointmentStatusService;
const cancelUnpaidAppointmentService = () => __awaiter(void 0, void 0, void 0, function* () {
    //console.log('cancel');
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); //30 minutes ago
    const unpaidAppointments = yield prisma_1.default.appointment.findMany({
        where: {
            createdAt: {
                lte: thirtyMinutesAgo,
            },
            paymentStatus: "UNPAID",
        },
    });
    const unpaidAppointmentIds = unpaidAppointments === null || unpaidAppointments === void 0 ? void 0 : unpaidAppointments.map((item) => item.id);
    if (unpaidAppointmentIds.length === 0) {
        //console.log('There is no unpaidAppointmentIds');
        return true;
    }
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01 delete payment
        yield tx.payment.deleteMany({
            where: {
                appointmentId: { in: unpaidAppointmentIds },
            },
        });
        //query-02 delete DoctorSchedule
        yield tx.doctorSchedules.updateMany({
            where: {
                appointmentId: { in: unpaidAppointmentIds },
            },
            data: {
                isBooked: false,
            },
        });
        //query-03 delete appointment
        yield tx.appointment.deleteMany({
            where: {
                id: { in: unpaidAppointmentIds },
            },
        });
    }));
});
exports.cancelUnpaidAppointmentService = cancelUnpaidAppointmentService;
const changePaymentStatusService = (appointmentId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentExist = yield prisma_1.default.appointment.findUnique({
        where: {
            id: appointmentId,
        },
    });
    //check if appointment does not exist
    if (!appointmentExist) {
        throw new ApiError_1.default(404, "appointmentId does not exist");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedAppointment = yield prisma_1.default.appointment.update({
            where: {
                id: appointmentId,
            },
            data: {
                paymentStatus: status,
            },
        });
        yield prisma_1.default.payment.update({
            where: {
                appointmentId: appointmentId,
            },
            data: {
                status,
            },
        });
        return updatedAppointment;
    }));
    return result;
});
exports.changePaymentStatusService = changePaymentStatusService;

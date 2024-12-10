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
exports.deleteMyScheduleService = exports.getAllDoctorSchedulesService = exports.getMySchedulesService = exports.createDoctorScheduleService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createDoctorScheduleService = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { schedules } = payload;
    const doctorExist = yield prisma_1.default.doctor.findFirst({
        where: {
            email
        }
    });
    //check if doctorId does not exist
    if (!doctorExist) {
        throw new ApiError_1.default(404, "doctorId does not exist");
    }
    const dataArr = schedules === null || schedules === void 0 ? void 0 : schedules.map((item) => ({
        doctorId: doctorExist.id,
        scheduleId: item
    }));
    const schedulesDataArr = [];
    for (const item of dataArr) {
        const doctorScheduleExist = yield prisma_1.default.doctorSchedules.findMany({
            where: {
                doctorId: item.doctorId,
                scheduleId: item.scheduleId
            }
        });
        //check doctorId & scheduleId is already existed
        if (doctorScheduleExist.length === 0) {
            schedulesDataArr.push(item);
        }
    }
    const result = yield prisma_1.default.doctorSchedules.createMany({
        data: schedulesDataArr
    });
    return result;
});
exports.createDoctorScheduleService = createDoctorScheduleService;
const getMySchedulesService = (email, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder, startDate, endDate, isBooked } = query, filters = __rest(query, ["page", "limit", "sortBy", "sortOrder", "startDate", "endDate", "isBooked"]);
    let filterQuery = [
        {
            doctor: {
                email: email,
            },
        },
    ];
    if (startDate && endDate) {
        filterQuery.push({
            schedule: {
                AND: [
                    {
                        startDateTime: {
                            gte: startDate,
                        },
                    },
                    {
                        endDateTime: {
                            lte: endDate,
                        },
                    },
                ],
            },
        });
    }
    if (isBooked) {
        filterQuery.push({
            isBooked: isBooked === "true" ? true : false
        });
    }
    //console.dir(filterQuery, {depth: Infinity});
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
    const result = yield prisma_1.default.doctorSchedules.findMany({
        where: whereConditions,
        skip: pagination.skip,
        take: pagination.limit,
        include: {
            schedule: true,
            appointment: true
        }
    });
    // Count total with matching the criteria
    const total = yield prisma_1.default.doctorSchedules.count({
        where: whereConditions
    });
    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
            total
        },
        data: result,
    };
});
exports.getMySchedulesService = getMySchedulesService;
const getAllDoctorSchedulesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder, startDate, endDate, isBooked } = query, filters = __rest(query, ["page", "limit", "sortBy", "sortOrder", "startDate", "endDate", "isBooked"]);
    let filterQuery = [];
    if (startDate && endDate) {
        filterQuery.push({
            schedule: {
                AND: [
                    {
                        startDateTime: {
                            gte: startDate,
                        },
                    },
                    {
                        endDateTime: {
                            lte: endDate,
                        },
                    },
                ],
            },
        });
    }
    if (isBooked) {
        filterQuery.push({
            isBooked: isBooked === "true" ? true : false
        });
    }
    //console.dir(filterQuery, {depth: Infinity});
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
    const result = yield prisma_1.default.doctorSchedules.findMany({
        where: whereConditions,
        skip: pagination.skip,
        take: pagination.limit,
        include: {
            schedule: true,
            doctor: true
        }
    });
    // Count total with matching the criteria
    const total = yield prisma_1.default.doctorSchedules.count({
        where: whereConditions
    });
    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
            total
        },
        data: result,
    };
});
exports.getAllDoctorSchedulesService = getAllDoctorSchedulesService;
const deleteMyScheduleService = (email, scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorExist = yield prisma_1.default.doctor.findUnique({
        where: {
            email
        },
    });
    //check if doctorId does not exist
    if (!doctorExist) {
        throw new ApiError_1.default(404, "doctorId does not exist");
    }
    const isBookedSchedule = yield prisma_1.default.doctorSchedules.findUnique({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorExist === null || doctorExist === void 0 ? void 0 : doctorExist.id,
                scheduleId: scheduleId
            },
            isBooked: true
        }
    });
    if (isBookedSchedule) {
        throw new ApiError_1.default(403, 'Failled to delete, This schedule is already booked');
    }
    const result = yield prisma_1.default.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorExist === null || doctorExist === void 0 ? void 0 : doctorExist.id,
                scheduleId: scheduleId
            }
        }
    });
    return result;
});
exports.deleteMyScheduleService = deleteMyScheduleService;

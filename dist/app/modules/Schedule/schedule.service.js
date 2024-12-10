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
exports.deleteScheduleService = exports.getSingleScheduleService = exports.getAllSchedulesService = exports.createScheduleService = void 0;
const date_fns_1 = require("date-fns");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const convertDateToUTCTime = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = date.getTimezoneOffset() * 60000; //getTimezone * 1 hour
    return new Date(date.getTime() + offset);
});
const createScheduleService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, startTime, endTime } = payload;
    const intervalTime = 30; //30 minutes
    const schedules = [];
    let currentDate = new Date(startDate); //2024-10-24T00:00:00.000Z
    const endDateObj = new Date(endDate);
    //const AddHours = addHours(StartDate, 5); //2024-10-24T05:00:00.000Z
    //const AddMinutes = addMinutes(StartDate, 30); // 2024-10-24T00:30:00.000Z
    while (currentDate <= endDateObj) {
        let currentDateStartDateTime = (0, date_fns_1.add)(currentDate, {
            hours: Number(startTime.split(':')[0]),
            minutes: Number(startTime.split(':')[1])
        });
        const currentDateEndDateTime = (0, date_fns_1.add)(currentDate, {
            hours: Number(endTime.split(':')[0]),
            minutes: Number(endTime.split(':')[1])
        });
        // Create slots for the current day
        //create schedule slot after 30 minutes interval
        while (currentDateStartDateTime < currentDateEndDateTime) {
            // const scheduleData = {
            //   startDateTime: currentDateStartDateTime,
            //   endDateTime: addMinutes(currentDateStartDateTime, intervalTime),
            // };
            //converted utc time
            const scheduleData = {
                startDateTime: yield convertDateToUTCTime(currentDateStartDateTime),
                endDateTime: yield convertDateToUTCTime((0, date_fns_1.addMinutes)(currentDateStartDateTime, intervalTime)),
            };
            const existingSchedule = yield prisma_1.default.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            });
            //if startDateTime & endDateTime does not exist
            if (!existingSchedule) {
                schedules.push(scheduleData);
            }
            // const result = await prisma.schedule.create({
            //   data: scheduleData,
            // });
            currentDateStartDateTime = (0, date_fns_1.addMinutes)(currentDateStartDateTime, intervalTime); //Move to the next 30-minute slot
        }
        // Move to the next day
        currentDate = (0, date_fns_1.addDays)(currentDate, 1);
    }
    //create-schedule
    const result = yield prisma_1.default.schedule.createMany({
        data: schedules
    });
    return result;
});
exports.createScheduleService = createScheduleService;
const getAllSchedulesService = (email, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder, startDate, endDate } = query, filters = __rest(query, ["page", "limit", "sortBy", "sortOrder", "startDate", "endDate"]);
    // Apply additional filters- filter-condition for specific field
    let filterQuery;
    if (startDate && endDate) {
        filterQuery = [
            {
                startDateTime: {
                    gte: startDate
                }
            },
            {
                endDateTime: {
                    lte: endDate
                }
            }
        ];
    }
    // Calculate pagination values & sorting
    const pagination = (0, QueryBuilder_1.calculatePaginationSorting)({ page, limit, sortBy, sortOrder });
    //doctor schedules for current doctor
    const doctorSchedules = yield prisma_1.default.doctorSchedules.findMany({
        where: {
            doctor: {
                email: email
            }
        }
    });
    const doctorScheduleIds = doctorSchedules.map((item) => item.scheduleId);
    const result = yield prisma_1.default.schedule.findMany({
        where: {
            AND: filterQuery,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
            [pagination.sortBy]: pagination.sortOrder,
        }
    });
    // Count total with matching the criteria
    const total = yield prisma_1.default.schedule.count({
        where: {
            AND: filterQuery,
            id: {
                notIn: doctorScheduleIds
            }
        }
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
exports.getAllSchedulesService = getAllSchedulesService;
const getSingleScheduleService = (scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.schedule.findUnique({
        where: {
            id: scheduleId,
        },
    });
    if (!result) {
        throw new ApiError_1.default(404, "This scheduleId does not exist");
    }
    return result;
});
exports.getSingleScheduleService = getSingleScheduleService;
const deleteScheduleService = (scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleExist = yield prisma_1.default.schedule.findUnique({
        where: {
            id: scheduleId
        }
    });
    if (!scheduleExist) {
        throw new ApiError_1.default(404, 'scheduleId does not exist');
    }
    const doctorScedules = yield prisma_1.default.doctorSchedules.findMany({
        where: {
            scheduleId
        }
    });
    if (doctorScedules.length > 0) {
        throw new ApiError_1.default(409, 'This scheduleId is associated with doctorSchedule');
    }
    const result = yield prisma_1.default.schedule.delete({
        where: {
            id: scheduleId
        }
    });
    return result;
});
exports.deleteScheduleService = deleteScheduleService;

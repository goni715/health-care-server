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
exports.getAllPrescriptionService = exports.getMyPrescriptionService = exports.createPrescriptionService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const patient_constant_1 = require("./patient.constant");
const createPrescriptionService = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentExist = yield prisma_1.default.appointment.findUnique({
        where: {
            id: payload.appointmentId,
        },
        include: {
            doctor: true,
        },
    });
    //check if appointmentId does not exist
    if (!appointmentExist) {
        throw new ApiError_1.default(404, "This appointmentId does not exist");
    }
    if (appointmentExist.doctor.email !== email) {
        throw new ApiError_1.default(404, "This appointment does not belong to this doctor");
    }
    //check if appointmentStatus is not completed
    if (appointmentExist.status !== "COMPLETED") {
        throw new ApiError_1.default(400, "This appointment is not completed");
    }
    if (appointmentExist.paymentStatus !== "PAID") {
        throw new ApiError_1.default(400, "Payment is unpaid");
    }
    const prescriptionExist = yield prisma_1.default.prescription.findUnique({
        where: {
            appointmentId: payload.appointmentId,
        },
    });
    if (prescriptionExist) {
        throw new ApiError_1.default(409, "Prescription already exist with this appointmentId");
    }
    //set doctorId & patientId
    payload.doctorId = appointmentExist.doctorId;
    payload.patientId = appointmentExist.patientId;
    const result = yield prisma_1.default.prescription.create({
        data: payload,
    });
    return result;
});
exports.createPrescriptionService = createPrescriptionService;
const getMyPrescriptionService = (email, role, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder"]);
    let filterQuery = [];
    let searchQuery = {};
    //if role is doctor
    if (role === "doctor") {
        filterQuery.push({
            doctor: {
                email: email,
            },
        });
        if (filters.email) {
            filterQuery.push({
                patient: {
                    email: filters.email,
                },
            });
        }
        if (searchTerm) {
            searchQuery = {
                patient: {
                    OR: (0, QueryBuilder_1.makeSearchQuery)(patient_constant_1.PrescriptionSearchableFields, searchTerm),
                },
            };
        }
    }
    //if role is patient
    if (role === "patient") {
        filterQuery.push({
            patient: {
                email: email,
            },
        });
        if (filters.email) {
            filterQuery.push({
                doctor: {
                    email: filters.email,
                },
            });
        }
        if (searchTerm) {
            searchQuery = {
                doctor: {
                    OR: (0, QueryBuilder_1.makeSearchQuery)(patient_constant_1.PrescriptionSearchableFields, searchTerm),
                },
            };
        }
    }
    //console.dir(filterQuery, {depth: Infinity});
    // Build the 'where' clause based on search and filter
    const whereConditions = Object.assign({ AND: filterQuery }, searchQuery);
    // Calculate pagination values & sorting
    const pagination = (0, QueryBuilder_1.calculatePaginationSorting)({
        page,
        limit,
        sortBy,
        sortOrder,
    });
    const result = yield prisma_1.default.prescription.findMany({
        where: whereConditions,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
            [pagination.sortBy]: pagination.sortOrder,
        },
        include: {
            doctor: true,
            patient: true,
        },
    });
    // Count total with matching the criteria
    const total = yield prisma_1.default.prescription.count({
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
exports.getMyPrescriptionService = getMyPrescriptionService;
const getAllPrescriptionService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder"]);
    let filterQuery;
    let searchQuery;
    if (searchTerm) {
        searchQuery = [
            {
                patient: {
                    OR: (0, QueryBuilder_1.makeSearchQuery)(patient_constant_1.PrescriptionSearchableFields, searchTerm),
                },
            },
            {
                doctor: {
                    OR: (0, QueryBuilder_1.makeSearchQuery)(patient_constant_1.PrescriptionSearchableFields, searchTerm),
                },
            },
        ];
    }
    // Apply additional filters- filter-condition for specific field
    if (Object.keys(filters).length > 0) {
        const filterResult = (0, QueryBuilder_1.makeFilterQuery)(filters);
        filterQuery = [
            {
                doctor: {
                    AND: filterResult,
                },
            },
            {
                patient: {
                    AND: filterResult,
                },
            },
        ];
    }
    // Build the 'where' clause based on search and filter
    const whereConditions = {
        AND: {
            OR: filterQuery,
        },
        OR: searchQuery,
    };
    //console.dir(whereConditions, {depth: Infinity});
    // Calculate pagination values & sorting
    const pagination = (0, QueryBuilder_1.calculatePaginationSorting)({
        page,
        limit,
        sortBy,
        sortOrder,
    });
    const result = yield prisma_1.default.prescription.findMany({
        where: whereConditions,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
            [pagination.sortBy]: pagination.sortOrder,
        },
        include: {
            doctor: true,
            patient: true,
        },
    });
    // Count total with matching the criteria
    const total = yield prisma_1.default.prescription.count({
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
exports.getAllPrescriptionService = getAllPrescriptionService;

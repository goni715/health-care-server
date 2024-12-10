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
exports.updatePatientService = exports.softDeletePatientService = exports.deletePatientService = exports.getSinglePatientService = exports.getAllPatientsService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const patient_constant_1 = require("./patient.constant");
const getAllPatientsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder"]);
    // Search if searchTerm is exist
    let searchQuery;
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(patient_constant_1.PatientSearchableFields, query.searchTerm);
    }
    // Apply additional filters- filter-condition for specific field
    let filterQuery;
    if (Object.keys(filters).length > 0) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    // Build the 'where' clause based on search and filter
    const whereConditions = {
        isDeleted: false,
        AND: filterQuery,
        OR: searchQuery,
    };
    // Calculate pagination values & sorting
    const pagination = (0, QueryBuilder_1.calculatePaginationSorting)({ page, limit, sortBy, sortOrder });
    const result = yield prisma_1.default.patient.findMany({
        where: whereConditions,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
            [pagination.sortBy]: pagination.sortOrder,
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    });
    // Count total patients matching the criteria
    const total = yield prisma_1.default.patient.count({
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
exports.getAllPatientsService = getAllPatientsService;
const getSinglePatientService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.patient.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    });
    if (!result) {
        throw new ApiError_1.default(404, "id does not exist");
    }
    return result;
});
exports.getSinglePatientService = getSinglePatientService;
const deletePatientService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield prisma_1.default.patient.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    //if id is not exist
    if (!patient) {
        throw new ApiError_1.default(404, "id does not exist");
    }
    const appointmentExist = yield prisma_1.default.appointment.findMany({
        where: {
            patientId: id
        },
    });
    //check if appointmentExist
    if (appointmentExist.length > 0) {
        throw new ApiError_1.default(409, 'This patientId is associated with Appointment');
    }
    const patientHealthDataExist = yield prisma_1.default.patientHealthData.findUnique({
        where: {
            patientId: patient.id
        }
    });
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01 delete medicalReport
        yield tx.medicalReport.deleteMany({
            where: {
                patientId: patient.id,
            },
        });
        //query-02 delete patientHealthData
        if (patientHealthDataExist) {
            yield tx.patientHealthData.delete({
                where: {
                    patientId: patient.id,
                },
            });
        }
        //query-03 patient delete
        const patientDeletedData = yield tx.patient.delete({
            where: {
                id,
            },
        });
        //query-04 delete-user
        yield tx.user.delete({
            where: {
                email: patientDeletedData.email,
            },
        });
        return patientDeletedData;
    }));
    return result;
});
exports.deletePatientService = deletePatientService;
const softDeletePatientService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //if id is not exist
    const patient = yield prisma_1.default.patient.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    //if id is not exist
    if (!patient) {
        throw new ApiError_1.default(404, "id does not exist");
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01-patient-delete
        const patientDeletedData = yield transactionClient.patient.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        //query-02- delete-user
        yield transactionClient.user.update({
            where: {
                email: patientDeletedData.email,
            },
            data: {
                isDeleted: true,
            },
        });
        return patientDeletedData;
    }));
    return result;
});
exports.softDeletePatientService = softDeletePatientService;
const updatePatientService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const patientExist = yield prisma_1.default.patient.findUnique({
        where: {
            id,
        },
    });
    //check id is not exist
    if (!patientExist) {
        throw new ApiError_1.default(404, "Id does not exist");
    }
    //update patient
    const result = yield prisma_1.default.patient.update({
        where: {
            id
        },
        data: payload
    });
    return result;
});
exports.updatePatientService = updatePatientService;

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
exports.filterDoctorBySpecialtiesService = exports.updateDoctorService = exports.softDeleteDoctorService = exports.deleteDoctorService = exports.getSingleDoctorService = exports.getAllDoctorsService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const doctor_constant_1 = require("./doctor.constant");
const getAllDoctorsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, specialties, page, limit, sortBy, sortOrder } = query, filters = __rest(query, ["searchTerm", "specialties", "page", "limit", "sortBy", "sortOrder"]);
    // Search if searchTerm is exist
    let searchQuery;
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        searchQuery = doctor_constant_1.DoctorSearchableFields.map((item) => ({
            [item]: {
                contains: query === null || query === void 0 ? void 0 : query.searchTerm,
                mode: "insensitive",
            },
        }));
    }
    // Apply additional filters- filter-condition for specific field
    let filterQuery = [];
    if (Object.keys(filters).length > 0) {
        filterQuery = Object.keys(filters).map((key) => ({
            [key]: {
                equals: filters[key],
            },
        }));
    }
    //filter relational field--
    //filter sepcialties
    if (specialties && (specialties === null || specialties === void 0 ? void 0 : specialties.length) > 0) {
        filterQuery = [
            ...filterQuery,
            {
                doctorSpecialties: {
                    some: {
                        specialties: {
                            title: {
                                contains: specialties,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            }
        ];
    }
    // Build the 'where' clause based on search and filter
    const whereConditions = {
        isDeleted: false,
        AND: filterQuery,
        OR: searchQuery,
    };
    // Calculate pagination values & sorting
    const pagination = (0, QueryBuilder_1.calculatePaginationSorting)({ page, limit, sortBy, sortOrder });
    const result = yield prisma_1.default.doctor.findMany({
        where: whereConditions,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
            [pagination.sortBy]: pagination.sortOrder,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });
    // Count total doctors matching the criteria
    const total = yield prisma_1.default.doctor.count({
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
exports.getAllDoctorsService = getAllDoctorsService;
const getSingleDoctorService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!result) {
        throw new ApiError_1.default(404, "id does not exist");
    }
    return result;
});
exports.getSingleDoctorService = getSingleDoctorService;
const deleteDoctorService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield prisma_1.default.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    //if id is not exist
    if (!doctor) {
        throw new ApiError_1.default(404, "id does not exist");
    }
    const appointmentExist = yield prisma_1.default.appointment.findMany({
        where: {
            doctorId: id
        },
    });
    //check if appointmentExist
    if (appointmentExist.length > 0) {
        throw new ApiError_1.default(409, 'This doctorId is associated with Appointment');
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01 delete doctorSpecialties
        yield transactionClient.doctorSpecialties.deleteMany({
            where: {
                doctorId: id,
            },
        });
        //query-02 delete doctorSchedules
        yield transactionClient.doctorSchedules.deleteMany({
            where: {
                doctorId: id,
            },
        });
        //query-03 doctor delete
        const doctorDeletedData = yield transactionClient.doctor.delete({
            where: {
                id,
            },
        });
        //query-04 delete-user
        yield transactionClient.user.delete({
            where: {
                email: doctorDeletedData.email,
            },
        });
        return doctorDeletedData;
    }));
    return result;
});
exports.deleteDoctorService = deleteDoctorService;
const softDeleteDoctorService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //if id is not exist
    const doctor = yield prisma_1.default.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    //if id is not exist
    if (!doctor) {
        throw new ApiError_1.default(404, "id does not exist");
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01-dcotor-delete
        const doctorDeletedData = yield transactionClient.doctor.update({
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
                email: doctorDeletedData.email,
            },
            data: {
                isDeleted: true,
            },
        });
        return doctorDeletedData;
    }));
    return result;
});
exports.softDeleteDoctorService = softDeleteDoctorService;
const updateDoctorService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { specialties } = payload, doctorData = __rest(payload, ["specialties"]);
    const doctorExist = yield prisma_1.default.doctor.findUnique({
        where: {
            id,
        },
    });
    //check id is not exist
    if (!doctorExist) {
        throw new ApiError_1.default(404, "Id does not exist");
    }
    //transaction started
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01 update doctor
        yield transactionClient.doctor.update({
            where: {
                id
            },
            data: doctorData
        });
        if (specialties && specialties.length > 0) {
            const deleteSpecialtiesIds = specialties.filter(item => item.isDeleted).map(item => item.specialtiesId);
            //query-02
            //delete doctor specialties by specialties & doctor id
            if (deleteSpecialtiesIds.length > 0) {
                for (const specialtiesId of deleteSpecialtiesIds) {
                    yield transactionClient.doctorSpecialties.deleteMany({
                        where: {
                            doctorId: doctorExist.id,
                            specialtiesId: specialtiesId
                        }
                    });
                }
            }
            //query-02
            //second way for deleting multiple doctorSpecialties
            // if (deleteSpecialtiesIds.length > 0) {
            //   const deleteDoctorSpecialties = await transactionClient.doctorSpecialties.deleteMany({
            //     where: {
            //       doctorId: doctorExist.id,
            //       specialtiesId: { in: deleteSpecialtiesIds } // Match any value in the array
            //     }
            //   });
            // }
            //query-03
            //create doctorSpecialties using createMany method
            const dataArr = specialties.filter(item => !item.isDeleted).map(item => ({
                doctorId: doctorExist.id,
                specialtiesId: item.specialtiesId,
            }));
            if (dataArr.length > 0) {
                //check doctorId & specialtiesId already exist
                const createSpecialtiesIds = specialties.filter(item => !item.isDeleted).map(item => item.specialtiesId);
                const doctorSpecialtiesExist = yield transactionClient.doctorSpecialties.findMany({
                    where: {
                        doctorId: doctorExist.id,
                        specialtiesId: { in: createSpecialtiesIds } // Match any value in the array
                    }
                });
                if (doctorSpecialtiesExist.length === 0) {
                    yield transactionClient.doctorSpecialties.createMany({
                        data: dataArr,
                    });
                }
            }
            // const dataArr = [
            //   {
            //     doctorId: '8937fdb8-f5d3-4c55-882d-72cccfc01b1c',
            //     specialtiesId: '2d0e28f0-4d3f-4f70-a102-ed43a80612f5'
            //   },
            //   {
            //     doctorId: '8937fdb8-f5d3-4c55-882d-72cccfc01b1c',
            //     specialtiesId: '8ba8dd81-5661-4073-8342-deeefa2d2533'
            //   }
            // ]
        }
    })); //transaction ended
    const result = yield prisma_1.default.doctor.findUnique({
        where: {
            id: doctorExist.id,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });
    return result;
});
exports.updateDoctorService = updateDoctorService;
const filterDoctorBySpecialtiesService = (specialtiesId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma_1.default.doctorSpecialties.findMany({
        where: {
            specialtiesId
        },
        include: {
            doctors: true
        }
    });
    const result = data === null || data === void 0 ? void 0 : data.map((item) => item.doctors);
    return result;
});
exports.filterDoctorBySpecialtiesService = filterDoctorBySpecialtiesService;

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
exports.updateMyProfilePhotoService = exports.updateMyProfileService = exports.getMyProfileService = exports.changeStatusService = exports.getAllUsersService = exports.createPatientService = exports.createDoctorService = exports.createAdminService = void 0;
const client_1 = require("@prisma/client");
const hashedPassword_1 = __importDefault(require("../../utils/hashedPassword"));
const uploadImageToCloudinary_1 = __importDefault(require("../../utils/uploadImageToCloudinary"));
const user_constant_1 = require("./user.constant");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const cloudinary_1 = __importDefault(require("../../helper/cloudinary"));
const findPublicId_1 = __importDefault(require("../../helper/findPublicId"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const prisma = new client_1.PrismaClient();
const createAdminService = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        email: payload.adminData.email,
        password: yield (0, hashedPassword_1.default)(payload.password),
        role: client_1.UserRole.admin,
    };
    const userExist = yield prisma.user.findUnique({
        where: {
            email: payload.adminData.email,
        },
    });
    //check email is already exist
    if (userExist) {
        throw new Error("This email is already existed");
    }
    //if there is a file -- upload image to cloudinary
    if (file) {
        const cloudinaryRes = yield (0, uploadImageToCloudinary_1.default)(file === null || file === void 0 ? void 0 : file.path);
        payload.adminData.profilePhoto = cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url;
    }
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01
        const createUser = yield transactionClient.user.create({
            data: userData,
        });
        //query-02
        const createAdmin = yield transactionClient.admin.create({
            data: payload.adminData,
        });
        return {
            createUser,
            createAdmin,
        };
    }));
    return result.createAdmin;
});
exports.createAdminService = createAdminService;
const createDoctorService = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        email: payload.doctorData.email,
        password: yield (0, hashedPassword_1.default)(payload.password),
        role: client_1.UserRole.doctor,
    };
    const userExist = yield prisma.user.findUnique({
        where: {
            email: payload.doctorData.email,
        },
    });
    //check email is already exist
    if (userExist) {
        throw new Error("This email is already existed");
    }
    //if there is a file -- upload image to cloudinary
    if (file) {
        const cloudinaryRes = yield (0, uploadImageToCloudinary_1.default)(file === null || file === void 0 ? void 0 : file.path);
        payload.doctorData.profilePhoto = cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url;
    }
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01
        const createUser = yield transactionClient.user.create({
            data: userData,
        });
        //query-02
        const createDoctor = yield transactionClient.doctor.create({
            data: payload.doctorData,
        });
        return {
            createUser,
            createDoctor,
        };
    }));
    return result.createDoctor;
});
exports.createDoctorService = createDoctorService;
const createPatientService = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        email: payload.patientData.email,
        password: yield (0, hashedPassword_1.default)(payload.password),
        role: client_1.UserRole.patient,
    };
    const userExist = yield prisma.user.findUnique({
        where: {
            email: payload.patientData.email,
        },
    });
    //check email is already exist
    if (userExist) {
        throw new Error("This email is already existed");
    }
    //if there is a file -- upload image to cloudinary
    if (file) {
        const cloudinaryRes = yield (0, uploadImageToCloudinary_1.default)(file === null || file === void 0 ? void 0 : file.path);
        payload.patientData.profilePhoto = cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url;
    }
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01
        const createdUser = yield transactionClient.user.create({
            data: userData,
        });
        //query-02
        const createdPatient = yield transactionClient.patient.create({
            data: payload.patientData,
        });
        return {
            createdUser,
            createdPatient,
        };
    }));
    return result.createdPatient;
});
exports.createPatientService = createPatientService;
const getAllUsersService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder } = query, filterData = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder"]);
    const andConditions = [];
    const searchQuery = user_constant_1.UserSearchableFields.map((item) => ({
        [item]: {
            contains: query === null || query === void 0 ? void 0 : query.searchTerm,
            mode: "insensitive",
        },
    }));
    const pagination = (0, QueryBuilder_1.calculatePaginationSorting)({ page, limit, sortBy, sortOrder });
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        andConditions.push({
            OR: searchQuery,
        });
    }
    //filter-condition for specific field
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    // whereConditions
    const whereConditions = { AND: andConditions };
    const result = yield prisma.user.findMany({
        where: whereConditions,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
            [pagination.sortBy]: pagination.sortOrder,
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
            // admin: true,
            // doctor: true,
            // patient: true
        },
        // include: {
        //   admin: true,
        //   doctor: true,
        //   patient: true,
        // },
    });
    const total = yield prisma.user.count({
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
exports.getAllUsersService = getAllUsersService;
const changeStatusService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield prisma.user.findUnique({
        where: {
            id,
        },
    });
    //check email is already exist
    if (!userExist) {
        throw new Error("User Not Found");
    }
    //update status
    const result = yield prisma.user.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
exports.changeStatusService = changeStatusService;
const getMyProfileService = (email, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    let profileData;
    //if role is admin
    if (role === "admin") {
        profileData = yield prisma.admin.findUnique({
            where: {
                email,
            },
            select: {
                name: true,
                profilePhoto: true,
                contactNumber: true,
            },
        });
    }
    //if role is doctor
    if (role === "doctor") {
        profileData = yield prisma.doctor.findUnique({
            where: {
                email,
            },
            select: {
                name: true,
                profilePhoto: true,
                contactNumber: true,
                address: true,
                registrationNumber: true,
                experience: true,
                gender: true,
                appointmentFee: true,
                qualification: true,
                currentWorkingPlace: true,
                designation: true,
            },
        });
    }
    //if role is patient
    if (role === "patient") {
        profileData = yield prisma.patient.findUnique({
            where: {
                email,
            },
            select: {
                name: true,
                profilePhoto: true,
                contactNumber: true,
                address: true,
            },
        });
    }
    return Object.assign(Object.assign({}, user), profileData);
});
exports.getMyProfileService = getMyProfileService;
const updateMyProfileService = (email, role, payload) => __awaiter(void 0, void 0, void 0, function* () {
    let profileData;
    //if role is admin
    if (role === "admin" && payload.adminData) {
        profileData = yield prisma.admin.update({
            where: {
                email,
            },
            data: payload.adminData,
        });
    }
    //if role is doctor
    if (role === "doctor" && payload.doctorData) {
        profileData = yield prisma.doctor.update({
            where: {
                email,
            },
            data: payload.doctorData,
        });
    }
    //if role is patient
    if (role === "patient" && payload.patientData) {
        profileData = yield prisma.patient.update({
            where: {
                email,
            },
            data: payload.patientData,
        });
    }
    return profileData;
});
exports.updateMyProfileService = updateMyProfileService;
const updateMyProfilePhotoService = (file, email, role) => __awaiter(void 0, void 0, void 0, function* () {
    //check if the file is not exist
    if (!file) {
        throw new ApiError_1.default(400, "File is required");
    }
    let profileData;
    //if role is admin
    if (role === "admin") {
        profileData = yield prisma.admin.findUnique({
            where: {
                email,
            },
        });
    }
    //if role is doctor
    if (role === "doctor") {
        profileData = yield prisma.doctor.findUnique({
            where: {
                email,
            },
        });
    }
    //if role is patient
    if (role === "patient") {
        profileData = yield prisma.patient.findUnique({
            where: {
                email,
            },
        });
    }
    if (!profileData) {
        throw new ApiError_1.default(404, "User does not exist");
    }
    //image upload to cloudinary
    const cloudinaryRes = yield (0, uploadImageToCloudinary_1.default)(file === null || file === void 0 ? void 0 : file.path);
    const profilePhoto = cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url;
    let updatedData;
    //if role is admin
    if (role === "admin") {
        updatedData = yield prisma.admin.update({
            where: {
                email,
            },
            data: {
                profilePhoto,
            },
        });
    }
    //if role is doctor
    if (role === "doctor") {
        updatedData = yield prisma.doctor.update({
            where: {
                email,
            },
            data: {
                profilePhoto,
            },
        });
    }
    //if role is patient
    if (role === "patient") {
        updatedData = yield prisma.patient.update({
            where: {
                email,
            },
            data: {
                profilePhoto,
            },
        });
    }
    //delete image from cloudinary
    if (profileData.profilePhoto) {
        const public_id = (0, findPublicId_1.default)(profileData.profilePhoto);
        yield cloudinary_1.default.uploader.destroy(public_id);
    }
    return updatedData;
});
exports.updateMyProfilePhotoService = updateMyProfilePhotoService;

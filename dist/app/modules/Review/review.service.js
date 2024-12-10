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
exports.getAllReviewsService = exports.createReviewService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const review_constant_1 = require("./review.constant");
const createReviewService = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentExist = yield prisma_1.default.appointment.findUnique({
        where: {
            id: payload.appointmentId,
        },
        include: {
            patient: true,
        },
    });
    //check if appointmentId does not exist
    if (!appointmentExist) {
        throw new ApiError_1.default(404, "This appointmentId does not exist");
    }
    if (appointmentExist.patient.email !== email) {
        throw new ApiError_1.default(400, "This is not your Appointment");
    }
    const reviewExist = yield prisma_1.default.review.findUnique({
        where: {
            appointmentId: payload.appointmentId,
        },
    });
    if (reviewExist) {
        throw new ApiError_1.default(409, "You have already prvided a review");
    }
    //set doctorId & patientId
    payload.doctorId = appointmentExist.doctorId;
    payload.patientId = appointmentExist.patientId;
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //query-01 create-review
        const createdReview = yield tx.review.create({
            data: payload,
        });
        //query-02 find averageRating
        const average = yield tx.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                doctorId: appointmentExist.doctorId
            }
        });
        //query-03 update doctor
        yield tx.doctor.update({
            where: {
                id: appointmentExist.doctorId
            },
            data: {
                averageRating: average._avg.rating
            }
        });
        return createdReview;
    }));
    return result;
});
exports.createReviewService = createReviewService;
const getAllReviewsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder"]);
    let searchQuery;
    if (searchTerm) {
        searchQuery = [
            {
                patient: {
                    OR: (0, QueryBuilder_1.makeSearchQuery)(review_constant_1.ReviewSearchableFields, searchTerm),
                },
            },
            {
                doctor: {
                    OR: (0, QueryBuilder_1.makeSearchQuery)(review_constant_1.ReviewSearchableFields, searchTerm),
                },
            },
        ];
    }
    // Build the 'where' clause based on search and filter
    const whereConditions = {
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
    const result = yield prisma_1.default.review.findMany({
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
    const total = yield prisma_1.default.review.count({
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
exports.getAllReviewsService = getAllReviewsService;

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
exports.updatePatientHealthDataService = exports.createPatientHealthDataService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("./../../errors/ApiError"));
const createPatientHealthDataService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //const { patientId } = payload;
    const patientId = payload.patientId;
    const patientExist = yield prisma_1.default.patient.findUnique({
        where: {
            id: patientId
        }
    });
    //check patientId does not exist
    if (!patientExist) {
        throw new ApiError_1.default(404, 'patientId does not exist');
    }
    const dataExist = yield prisma_1.default.patientHealthData.findUnique({
        where: {
            patientId: patientId
        }
    });
    //if patientId is exist on patientHealthData
    if (dataExist) {
        throw new ApiError_1.default(409, 'patientId is already exist');
    }
    //create patient-health-data
    const result = yield prisma_1.default.patientHealthData.create({
        data: payload
    });
    return result;
});
exports.createPatientHealthDataService = createPatientHealthDataService;
const updatePatientHealthDataService = (patientId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const patientExist = yield prisma_1.default.patientHealthData.findUnique({
        where: {
            patientId: patientId
        }
    });
    //check id is not exist
    if (!patientExist) {
        throw new ApiError_1.default(404, "patientId does not exist");
    }
    //update patientHealthData
    const result = yield prisma_1.default.patientHealthData.update({
        where: {
            patientId
        },
        data: payload
    });
    return result;
});
exports.updatePatientHealthDataService = updatePatientHealthDataService;

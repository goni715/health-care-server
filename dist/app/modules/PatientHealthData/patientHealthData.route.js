"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientHealthDataRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const patientHealthData_controller_1 = require("./patientHealthData.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const patientHealthData_validation_1 = require("./patientHealthData.validation");
const router = express_1.default.Router();
router.post("/create-patient-health-data", (0, AuthMiddleware_1.default)("admin", "super_admin", 'doctor', 'patient'), (0, validateRequest_1.default)(patientHealthData_validation_1.createPatientHealthDataSchema), patientHealthData_controller_1.PatientHealthDataController.createPatientHealthData);
router.patch("/update-patient-health-data/:patientId", (0, AuthMiddleware_1.default)("admin", "super_admin", 'doctor', 'patient'), (0, validateRequest_1.default)(patientHealthData_validation_1.updatePatientHealthDataSchema), patientHealthData_controller_1.PatientHealthDataController.updatePatientHealthData);
exports.PatientHealthDataRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const patient_controller_1 = require("./patient.controller");
const client_1 = require("@prisma/client");
const patient_validation_1 = require("./patient.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.get('/get-all-patients', (0, AuthMiddleware_1.default)("admin", 'super_admin', 'doctor'), patient_controller_1.PatientController.getAllPatients);
router.get("/get-single-patient/:id", (0, AuthMiddleware_1.default)("admin", "super_admin"), patient_controller_1.PatientController.getSinglePatient);
router.delete("/delete-patient/:id", (0, AuthMiddleware_1.default)(client_1.UserRole.admin, client_1.UserRole.super_admin), patient_controller_1.PatientController.deletePatient);
router.delete("/soft-delete-patient/:id", (0, AuthMiddleware_1.default)(client_1.UserRole.admin, client_1.UserRole.super_admin), patient_controller_1.PatientController.softDeletePatient);
router.patch("/update-patient/:id", (0, AuthMiddleware_1.default)(client_1.UserRole.admin, client_1.UserRole.super_admin, client_1.UserRole.doctor, client_1.UserRole.patient), (0, validateRequest_1.default)(patient_validation_1.updatePatientSchema), patient_controller_1.PatientController.updatePatient);
exports.PatientRoutes = router;

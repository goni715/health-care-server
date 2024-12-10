"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalReportRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const medicalReport_controller_1 = require("./medicalReport.controller");
const medicalReport_validation_1 = require("./medicalReport.validation");
const router = express_1.default.Router();
router.post("/create-medical-report", (0, AuthMiddleware_1.default)("admin", "super_admin", 'doctor'), (0, validateRequest_1.default)(medicalReport_validation_1.createMedicalReportSchema), medicalReport_controller_1.MedicalReportController.createMedicalReport);
router.delete("/delete-medical-report/:patientId/:reportId", (0, AuthMiddleware_1.default)("admin", "super_admin", 'doctor'), medicalReport_controller_1.MedicalReportController.deleteMedicalReport);
exports.MedicalReportRoutes = router;

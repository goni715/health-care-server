"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const upload_1 = __importDefault(require("../../helper/upload"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_validation_1 = require("../Admin/admin.validation");
const user_controller_1 = require("./user.controller");
const doctor_validation_1 = require("../Doctor/doctor.validation");
const patient_validation_1 = require("../Patient/patient.validation");
const client_1 = require("@prisma/client");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post("/create-admin", (0, AuthMiddleware_1.default)("admin", "super_admin"), upload_1.default.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(admin_validation_1.createAdminValidationSchema), user_controller_1.UserController.createAdmin);
router.post("/create-doctor", (0, AuthMiddleware_1.default)("admin", "super_admin"), upload_1.default.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(doctor_validation_1.createDoctorSchema), user_controller_1.UserController.createDoctor);
router.post("/create-patient", upload_1.default.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(patient_validation_1.createPatientSchema), user_controller_1.UserController.createPatient);
router.get('/get-all-users', (0, AuthMiddleware_1.default)(client_1.UserRole.admin, client_1.UserRole.super_admin), user_controller_1.UserController.getAllUsers);
router.patch('/change-status/:id', (0, AuthMiddleware_1.default)('admin', 'super_admin'), (0, validateRequest_1.default)(user_validation_1.changeStatusValidationSchema), user_controller_1.UserController.changeStatus);
router.get('/get-my-profile', (0, AuthMiddleware_1.default)("admin", 'super_admin', 'doctor', 'patient'), user_controller_1.UserController.getMyProfile);
router.patch('/update-my-profile', (0, AuthMiddleware_1.default)('admin', 'super_admin', 'doctor', 'patient'), (0, validateRequest_1.default)(user_validation_1.updateMyProfileSchema), user_controller_1.UserController.updateMyProfile);
router.patch('/update-my-profile-photo', (0, AuthMiddleware_1.default)('admin', 'doctor', 'patient'), upload_1.default.single('file'), user_controller_1.UserController.updateMyProfilePhoto);
exports.UserRoutes = router;

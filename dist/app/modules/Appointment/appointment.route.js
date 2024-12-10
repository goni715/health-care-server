"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const appointment_controller_1 = require("./appointment.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const appointment_validation_1 = require("./appointment.validation");
const router = express_1.default.Router();
router.post("/create-appointment", (0, AuthMiddleware_1.default)("patient"), (0, validateRequest_1.default)(appointment_validation_1.createAppointmentSchema), appointment_controller_1.AppointmentController.createAppointment);
router.get("/get-my-appointments", (0, AuthMiddleware_1.default)("doctor", "patient"), appointment_controller_1.AppointmentController.getMyAppointments);
router.get("/get-all-appointments", (0, AuthMiddleware_1.default)("admin", "super_admin"), appointment_controller_1.AppointmentController.getAllAppointments);
router.patch("/change-appointment-status/:id", (0, AuthMiddleware_1.default)("admin", "super_admin", "doctor"), (0, validateRequest_1.default)(appointment_validation_1.changeAppointmentStatusSchema), appointment_controller_1.AppointmentController.changeAppointmentStatus);
router.patch("/change-payment-status/:id", (0, AuthMiddleware_1.default)("admin", "super_admin"), (0, validateRequest_1.default)(appointment_validation_1.changePaymentStatusSchema), appointment_controller_1.AppointmentController.changePaymentStatus);
exports.AppointmentRoutes = router;

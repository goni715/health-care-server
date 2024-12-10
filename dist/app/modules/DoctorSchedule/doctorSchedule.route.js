"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const doctorSchedule_controller_1 = require("./doctorSchedule.controller");
const router = express_1.default.Router();
router.post("/create-doctor-schedule", (0, AuthMiddleware_1.default)("doctor"), doctorSchedule_controller_1.DoctorScheduleController.createDoctorSchedule);
router.get('/get-my-schedules', (0, AuthMiddleware_1.default)('doctor'), doctorSchedule_controller_1.DoctorScheduleController.getMySchedules);
router.get('/get-all-doctor-schedules', (0, AuthMiddleware_1.default)('admin', 'super_admin'), doctorSchedule_controller_1.DoctorScheduleController.getAllDoctorSchedules);
router.delete('/delete-my-schedule/:scheduleId', (0, AuthMiddleware_1.default)('doctor'), doctorSchedule_controller_1.DoctorScheduleController.deleteMySchedule);
exports.DoctorScheduleRoutes = router;

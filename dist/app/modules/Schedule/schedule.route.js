"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const schedule_controller_1 = require("./schedule.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const schedule_validation_1 = require("./schedule.validation");
const router = express_1.default.Router();
router.post("/create-schedule", (0, AuthMiddleware_1.default)("admin", "super_admin"), (0, validateRequest_1.default)(schedule_validation_1.createScheduleSchema), schedule_controller_1.ScheduleController.createSchedule);
router.get('/get-all-schedules', (0, AuthMiddleware_1.default)('doctor'), schedule_controller_1.ScheduleController.getAllSchedules);
router.get('/get-single-schedule/:scheduleId', (0, AuthMiddleware_1.default)('admin', 'super_admin'), schedule_controller_1.ScheduleController.getSingleSchedule);
router.delete('/delete-schedule/:scheduleId', (0, AuthMiddleware_1.default)('admin', 'super_admin'), schedule_controller_1.ScheduleController.deleteSchedule);
exports.ScheduleRoutes = router;

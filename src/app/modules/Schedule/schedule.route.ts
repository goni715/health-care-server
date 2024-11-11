import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { ScheduleController } from './schedule.controller';


const router = express.Router();



router.post(
  "/create-schedule",
  AuthMiddleware("admin", "super_admin"),
  ScheduleController.createSchedule
);

router.get('/get-all-schedules', AuthMiddleware("admin", 'super_admin'), ScheduleController.getAllSchedules);


export const ScheduleRoutes = router;
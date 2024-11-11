import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { ScheduleController } from './schedule.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createScheduleSchema } from './schedule.validation';


const router = express.Router();



router.post(
  "/create-schedule",
  AuthMiddleware("admin", "super_admin"),
  validateRequest(createScheduleSchema),
  ScheduleController.createSchedule
);

router.get('/get-all-schedules', AuthMiddleware('doctor'), ScheduleController.getAllSchedules);


export const ScheduleRoutes = router;
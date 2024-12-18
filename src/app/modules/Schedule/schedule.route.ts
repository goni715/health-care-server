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

router.get('/get-all-schedules', AuthMiddleware('admin', 'doctor'), ScheduleController.getAllSchedules);
router.get('/get-single-schedule/:scheduleId', AuthMiddleware('admin', 'super_admin'), ScheduleController.getSingleSchedule);
router.delete('/delete-schedule/:scheduleId', AuthMiddleware('admin', 'super_admin'), ScheduleController.deleteSchedule);


export const ScheduleRoutes = router;
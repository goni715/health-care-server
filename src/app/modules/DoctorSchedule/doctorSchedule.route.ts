import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { DoctorScheduleController } from './doctorSchedule.controller';


const router = express.Router();



router.post(
  "/create-doctor-schedule",
  AuthMiddleware("doctor"),
  DoctorScheduleController.createDoctorSchedule
);


router.get('/get-doctor-schedules', AuthMiddleware('doctor'), DoctorScheduleController.getDoctorSchedules);




export const DoctorScheduleRoutes = router;
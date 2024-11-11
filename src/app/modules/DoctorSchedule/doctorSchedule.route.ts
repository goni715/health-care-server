import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { DoctorScheduleController } from './doctorSchedule.controller';


const router = express.Router();



router.post(
  "/create-doctor-schedule",
  AuthMiddleware("doctor"),
  DoctorScheduleController.createDoctorSchedule
);



export const DoctorScheduleRoutes = router;
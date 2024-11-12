import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { AppointmentController } from './appointment.controller';


const router = express.Router();



router.post(
  "/create-appointment",
  AuthMiddleware("patient"),
  AppointmentController.createAppointment
);


export const AppointmentRoutes = router;
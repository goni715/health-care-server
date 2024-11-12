import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { AppointmentController } from './appointment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createAppointmentSchema } from './appointment.validation';


const router = express.Router();



router.post(
  "/create-appointment",
  AuthMiddleware("patient"),
  validateRequest(createAppointmentSchema),
  AppointmentController.createAppointment
);


router.get(
  "/get-my-appointments",
  AuthMiddleware("doctor", "patient"),
  AppointmentController.getMyAppointments
);

router.get(
  "/get-all-appointments",
  AuthMiddleware("admin", "super_admin"),
  AppointmentController.getAllAppointments
);

export const AppointmentRoutes = router;
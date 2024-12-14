import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { DoctorScheduleController } from './doctorSchedule.controller';


const router = express.Router();



router.post(
  "/create-doctor-schedule",
  AuthMiddleware("doctor"),
  DoctorScheduleController.createDoctorSchedule
);


router.get('/get-my-schedules', AuthMiddleware('doctor'), DoctorScheduleController.getMySchedules);
router.get('/get-all-doctor-schedules', AuthMiddleware('admin', 'super_admin', 'doctor', 'patient'), DoctorScheduleController.getAllDoctorSchedules);
router.delete('/delete-my-schedule/:scheduleId', AuthMiddleware('doctor'), DoctorScheduleController.deleteMySchedule);



export const DoctorScheduleRoutes = router;
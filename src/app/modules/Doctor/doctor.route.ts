import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { DoctorController } from './doctor.controller';


const router = express.Router();



router.get('/get-all-doctors', AuthMiddleware("admin", 'super_admin'), DoctorController.getAllDoctors);


export const DoctorRoutes = router;
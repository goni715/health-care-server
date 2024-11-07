import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '@prisma/client';
import { DoctorController } from './doctor.controller';


const router = express.Router();



router.get('/get-all-doctors', AuthMiddleware("admin", 'super_admin'), DoctorController.getAllDoctors);


export const AdminRoutes = router;
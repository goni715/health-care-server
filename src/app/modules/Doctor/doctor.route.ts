import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { DoctorController } from './doctor.controller';
import { UserRole } from '@prisma/client';


const router = express.Router();



router.get('/get-all-doctors', AuthMiddleware("admin", 'super_admin'), DoctorController.getAllDoctors);
router.get('/get-single-doctor/:id', AuthMiddleware("admin", 'super_admin'), DoctorController.getSingleDoctor);
router.delete('/delete-doctor/:id', AuthMiddleware(UserRole.admin, UserRole.super_admin), DoctorController.deleteDoctor);
router.delete('/soft-delete-doctor/:id', AuthMiddleware(UserRole.admin, UserRole.super_admin), DoctorController.softDeleteDoctor);


export const DoctorRoutes = router;
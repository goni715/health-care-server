import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { DoctorController } from './doctor.controller';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { updateDoctorSchema } from './doctor.validation';


const router = express.Router();



router.get(
  "/get-all-doctors",
  DoctorController.getAllDoctors
);
router.get(
  "/get-single-doctor/:id",
  DoctorController.getSingleDoctor
);
router.delete(
  "/delete-doctor/:id",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  DoctorController.deleteDoctor
);
router.delete(
  "/soft-delete-doctor/:id",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  DoctorController.softDeleteDoctor
);
router.patch(
  "/update-doctor/:id",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validateRequest(updateDoctorSchema),
  DoctorController.updateDoctor
);

router.get(
  "/filter-doctor-by-specialties/:specialtiesId",
  AuthMiddleware("admin", "super_admin"),
  DoctorController.filterDoctorBySpecialties
);

export const DoctorRoutes = router;
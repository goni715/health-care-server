import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { PatientController } from './patient.controller';
import { UserRole } from '@prisma/client';
import { updatePatientSchema } from './patient.validation';
import validateRequest from '../../middlewares/validateRequest';


const router = express.Router();



router.get('/get-all-patients', AuthMiddleware("admin", 'super_admin', 'doctor'), PatientController.getAllPatients);
router.get(
    "/get-single-patient/:id",
    AuthMiddleware("admin", "super_admin"),
    PatientController.getSinglePatient
  );
  router.delete(
    "/delete-patient/:id",
    AuthMiddleware(UserRole.admin, UserRole.super_admin),
    PatientController.deletePatient
  );
  router.delete(
    "/soft-delete-patient/:id",
    AuthMiddleware(UserRole.admin, UserRole.super_admin),
    PatientController.softDeletePatient
  );

  router.patch(
    "/update-patient/:id",
    AuthMiddleware(UserRole.admin, UserRole.super_admin, UserRole.doctor, UserRole.patient),
     validateRequest(updatePatientSchema),
    PatientController.updatePatient
  );

export const PatientRoutes = router;
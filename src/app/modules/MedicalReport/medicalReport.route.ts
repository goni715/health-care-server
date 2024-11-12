import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { MedicalReportController } from './medicalReport.controller';
import { createMedicalReportSchema } from './medicalReport.validation';


const router = express.Router();



router.post(
  "/create-medical-report",
  AuthMiddleware("admin", "super_admin", 'doctor'),
  validateRequest(createMedicalReportSchema),
  MedicalReportController.createMedicalReport
);

router.delete(
  "/delete-medical-report/:patientId/:reportId",
  AuthMiddleware("admin", "super_admin", 'doctor'),
  MedicalReportController.deleteMedicalReport
);


export const MedicalReportRoutes = router;
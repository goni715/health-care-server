import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { MedicalReportController } from './medicalReport.controller';
import { createMedicalReportSchema } from './medicalReport.validation';


const router = express.Router();



router.post(
  "/create-prescription",
  AuthMiddleware("doctor"),
  validateRequest(createMedicalReportSchema),
  MedicalReportController.createMedicalReport
);


export const PrescriptionRoutes = router;
import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { MedicalReportController } from './medicalReport.controller';


const router = express.Router();



router.post(
  "/create-medical-report",
  AuthMiddleware("admin", "super_admin", 'doctor'),
  MedicalReportController.createMedicalReport
);



export const MedicalReportRoutes = router;
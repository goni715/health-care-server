import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { PatientHealthDataController } from './patientHealthData.controller';


const router = express.Router();



router.post(
  "/create-patient-health-data/:patientId",
  AuthMiddleware("admin", "super_admin", 'doctor', 'patient'),
  PatientHealthDataController.createPatientHealthData
);




export const PatientHealthDataRoutes = router;
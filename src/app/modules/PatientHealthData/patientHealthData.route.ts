import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { PatientHealthDataController } from './patientHealthData.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createPatientHealthDataSchema } from './patientHealthData.validation';


const router = express.Router();



router.post(
  "/create-patient-health-data/:patientId",
  AuthMiddleware("admin", "super_admin", 'doctor', 'patient'),
  validateRequest(createPatientHealthDataSchema),
  PatientHealthDataController.createPatientHealthData
);




export const PatientHealthDataRoutes = router;
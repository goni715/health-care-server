import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { PatientHealthDataController } from './patientHealthData.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createPatientHealthDataSchema, updatePatientHealthDataSchema } from './patientHealthData.validation';


const router = express.Router();



router.post(
  "/create-patient-health-data",
  AuthMiddleware("admin", "super_admin", 'doctor', 'patient'),
  validateRequest(createPatientHealthDataSchema),
  PatientHealthDataController.createPatientHealthData
);


router.patch(
  "/update-patient-health-data/:patientId",
  AuthMiddleware("admin", "super_admin", 'doctor', 'patient'),
   validateRequest(updatePatientHealthDataSchema),
   PatientHealthDataController.updatePatientHealthData
);


export const PatientHealthDataRoutes = router;
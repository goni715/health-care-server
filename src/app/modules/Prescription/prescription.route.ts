import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { PrescriptionController } from './prescription.controller';


const router = express.Router();



router.post(
  "/create-prescription/:appointmentId",
  AuthMiddleware("doctor"),
  //validateRequest(createMedicalReportSchema),
  PrescriptionController.createPrescription
);


export const PrescriptionRoutes = router;
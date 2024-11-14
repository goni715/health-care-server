import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { PrescriptionController } from './prescription.controller';


const router = express.Router();



router.post(
  "/create-prescription",
  AuthMiddleware("doctor"),
  //validateRequest(createMedicalReportSchema),
  PrescriptionController.createPrescription
);

router.get(
  "/get-my-prescription",
  AuthMiddleware("doctor", "patient"),
  PrescriptionController.getMyPrescription
);

export const PrescriptionRoutes = router;
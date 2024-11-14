import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { PrescriptionController } from './prescription.controller';
import { createPrescriptionSchema } from './prescription.validation';
import validateRequest from '../../middlewares/validateRequest';


const router = express.Router();



router.post(
  "/create-prescription",
  AuthMiddleware("doctor"),
  validateRequest(createPrescriptionSchema),
  PrescriptionController.createPrescription
);

router.get(
  "/get-my-prescription",
  AuthMiddleware("doctor", "patient"),
  PrescriptionController.getMyPrescription
);

export const PrescriptionRoutes = router;
import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { PaymentController } from './payment.controller';


const router = express.Router();



router.post(
  "/init-payment/:appointmentId",
  AuthMiddleware("patient"),
  PaymentController.initPaymentt
);

router.get("/success/:appointmentId", PaymentController.PaymentSuccess);

export const PaymentRoutes = router;
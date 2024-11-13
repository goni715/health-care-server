import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { PaymentController } from './payment.controller';


const router = express.Router();



router.post(
  "/init-payment/:appointmentId",
  AuthMiddleware("patient"),
  PaymentController.initPayment
);

router.get(
  "/validate-payment",
  PaymentController.validatePayment
);

router.post("/success/:appointmentId", PaymentController.paymentSuccess);

export const PaymentRoutes = router;
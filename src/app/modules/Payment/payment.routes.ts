import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { PaymentController } from './payment.controller';


const router = express.Router();



router.post(
  "/init-payment",
  AuthMiddleware("patient"),
  PaymentController.initPaymentt

);



export const PaymentRoutes = router;
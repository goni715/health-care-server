import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';


const router = express.Router();



router.post(
  "/create-review",
  AuthMiddleware("patient"),
  //validateRequest(createPrescriptionSchema),
  ReviewController.createReview
);



export const ReviewRoutes = router;
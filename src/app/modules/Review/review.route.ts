import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { createReviewSchema } from './review.validation';


const router = express.Router();



router.post(
  "/create-review",
  AuthMiddleware("patient"),
  validateRequest(createReviewSchema),
  ReviewController.createReview
);



export const ReviewRoutes = router;
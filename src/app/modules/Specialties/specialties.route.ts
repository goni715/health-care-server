import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { SpecialtiesController } from './specialties.controller';


const router = express.Router();



router.post(
  "/create-admin",
  AuthMiddleware("admin", "super_admin"),
  SpecialtiesController.createSpecialties
);



export const SpecialtiesRoutes = router;
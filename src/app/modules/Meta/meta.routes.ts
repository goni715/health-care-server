import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { MetaController } from './meta.controller';


const router = express.Router();



router.get(
  "/fetch-meta-data",
  AuthMiddleware("admin", "super_admin", 'doctor', 'patient'),
  MetaController.fetchDashboardMetaData
);

export const MetaRoutes = router;
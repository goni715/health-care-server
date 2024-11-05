import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import upload from '../../helper/upload';
import validateRequest from '../../middlewares/validateRequest';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { UserController } from './user.controller';
import { createDoctorSchema } from '../Doctor/doctor.validation';
import { createPatientSchema } from '../Patient/patient.validation';

const router = express.Router();



router.post(
  "/create-admin",
  AuthMiddleware("admin", "super_admin"),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin
);


router.post(
  "/create-doctor",
  AuthMiddleware("admin", "super_admin"),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createDoctorSchema),
  UserController.createDoctor
);



router.post(
  "/create-patient",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createPatientSchema),
  UserController.createDoctor
);



export const UserRoutes = router;
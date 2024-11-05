import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import upload from '../../helper/upload';
import validateRequest from '../../middlewares/validateRequest';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { UserController } from './user.controller';
import { createDoctorSchema } from '../Doctor/doctor.validation';

const router = express.Router();



router.post(
  "/create-admin",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createAdminValidationSchema),
  AuthMiddleware("admin", "super_admin"),
  UserController.createAdmin
);


router.post(
  "/create-doctor",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createDoctorSchema),
  AuthMiddleware("admin", "super_admin"),
  UserController.createDoctor
);



export const UserRoutes = router;
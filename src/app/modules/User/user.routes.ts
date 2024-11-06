import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import upload from '../../helper/upload';
import validateRequest from '../../middlewares/validateRequest';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { UserController } from './user.controller';
import { createDoctorSchema } from '../Doctor/doctor.validation';
import { createPatientSchema } from '../Patient/patient.validation';
import { UserRole } from '@prisma/client';
import { changeStatusValidationSchema, updateMyProfileSchema } from './user.validation';

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
  UserController.createPatient
);


router.get('/get-all-users', AuthMiddleware(UserRole.admin, UserRole.super_admin), UserController.getAllUsers);

router.patch(
  '/change-status/:id',
  AuthMiddleware('admin', 'super_admin'),
  validateRequest(changeStatusValidationSchema),
  UserController.changeStatus
);

router.get('/get-my-profile', AuthMiddleware("admin", 'super_admin', 'doctor', 'patient'), UserController.getMyProfile);


router.patch(
  '/update-my-profile',
  AuthMiddleware('admin', 'super_admin', 'doctor', 'patient'),
  validateRequest(updateMyProfileSchema),
  UserController.updateMyProfile
);

export const UserRoutes = router;
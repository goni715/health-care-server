import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { SpecialtiesController } from './specialties.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSpecialtiesSchema } from './specialties.validation';
import upload from '../../helper/upload';
import { UserRole } from '@prisma/client';


const router = express.Router();



router.post(
  "/create-specialties",
  AuthMiddleware("admin", "super_admin"),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createSpecialtiesSchema),
  SpecialtiesController.createSpecialties
);


router.get('/get-all-specialties', SpecialtiesController.getAllSpecialties);
router.delete('/delete-specialties/:id', AuthMiddleware('admin', 'super_admin', 'doctor', 'patient'), SpecialtiesController.deleteSpecialties)
router.patch(
  '/update-icon/:id',
  AuthMiddleware('admin', 'doctor', 'super_admin'),
  upload.single('file'),
  SpecialtiesController.updateIcon
);


export const SpecialtiesRoutes = router;
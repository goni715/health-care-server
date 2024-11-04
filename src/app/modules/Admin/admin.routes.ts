import express from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '@prisma/client';


const router = express.Router();



router.get('/get-all-admins', AuthMiddleware(UserRole.admin, UserRole.super_admin), adminController.getAllAdmins);
router.get('/get-single-admin/:id', AuthMiddleware(UserRole.admin, UserRole.super_admin), adminController.getSingleAdmin);
router.patch('/update-admin/:id', AuthMiddleware(UserRole.admin, UserRole.super_admin), validateRequest(updateAdminValidationSchema), adminController.updateAdmin);
router.delete('/delete-admin/:id', AuthMiddleware(UserRole.admin, UserRole.super_admin), adminController.deleteAdmin);
router.delete('/soft-delete-admin/:id', AuthMiddleware(UserRole.admin, UserRole.super_admin), adminController.softDeleteAdmin);



export const AdminRoutes = router;
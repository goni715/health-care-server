import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { changePasswordValidationSchema, forgotPasswordValidationSchema, loginUserValidationSchema, refreshTokenValidationSchema, resetPasswordValidationSchema } from './auth.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();


router.post('/login', validateRequest(loginUserValidationSchema), AuthController.loginUser);
//get new accessToken by refreshToken
router.post('/refresh-token', validateRequest(refreshTokenValidationSchema), AuthController.refreshToken)
router.patch('/change-password', AuthMiddleware('admin', 'super_admin', 'doctor', 'patient'), validateRequest(changePasswordValidationSchema), AuthController.changePassword)
router.post('/forgot-password', validateRequest(forgotPasswordValidationSchema), AuthController.forgotPassword)
router.patch('/reset-password', validateRequest(resetPasswordValidationSchema), AuthController.resetPassword)



export const AuthRoutes = router;
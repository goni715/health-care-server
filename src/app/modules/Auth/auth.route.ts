import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { changePasswordValidationSchema, loginUserValidationSchema, refreshTokenValidationSchema } from './auth.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();


router.post('/login', validateRequest(loginUserValidationSchema), AuthController.loginUser);
//get new accessToken by refreshToken
router.post('/refresh-token', validateRequest(refreshTokenValidationSchema), AuthController.refreshToken)
router.patch('/change-password', AuthMiddleware('admin', 'super_admin', 'doctor', 'patient'), validateRequest(changePasswordValidationSchema), AuthController.changePassword)




export const AuthRoutes = router;
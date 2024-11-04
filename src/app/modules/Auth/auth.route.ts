import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { loginUserValidationSchema, refreshTokenValidationSchema } from './auth.validation';

const router = express.Router();


router.post('/login', validateRequest(loginUserValidationSchema), AuthController.loginUser);
//get new accessToken by refreshToken
router.post('/refresh-token', validateRequest(refreshTokenValidationSchema), AuthController.refreshToken)




export const AuthRoutes = router;
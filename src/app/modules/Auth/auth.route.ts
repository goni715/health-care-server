import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { loginUserValidationSchema } from './auth.validation';

const router = express.Router();


router.post('/login', validateRequest(loginUserValidationSchema), AuthController.loginUser)




export const AuthRoutes = router;
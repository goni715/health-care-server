import express from 'express';
import { userController } from './user.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();



router.post('/create-admin', AuthMiddleware('admin'), userController.createAdmin)



export const userRoutes = router;
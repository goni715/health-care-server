import express from 'express';
import { userController } from './user.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import upload from '../../helper/upload';

const router = express.Router();



router.post('/create-admin', AuthMiddleware('admin', 'super_admin'), upload.single('file'), userController.createAdmin)



export const userRoutes = router;
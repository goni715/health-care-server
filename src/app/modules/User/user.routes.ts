import express from 'express';
import { userController } from './user.controller';

const router = express.Router();



router.get('/create-admin', userController.createAdmin)



export const userRoutes = router;
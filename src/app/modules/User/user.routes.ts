import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import upload from '../../helper/upload';

const router = express.Router();



router.post(
  "/create-admin",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  AuthMiddleware("admin", "super_admin"),
  userController.createAdmin
);



export const userRoutes = router;
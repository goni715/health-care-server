import { NextFunction, Request, Response } from "express";
import verifyToken from "../utils/verifyToken";
import config from "../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import prisma from "../shared/prisma";

type TUserRole = "admin" | "super_admin" | "doctor" | "patient";

const AuthMiddleware = (...roles: TUserRole[]) => {
  return async (req: Request & {user?: any}, res: Response, next: NextFunction) : Promise<any> => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
          error: "jwt token must be provided",
        });
      }

      //token-verify
      const decoded = verifyToken(
        token,
        config.jwt_access_secret as Secret
      );


      //check if role is matching
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(401).json({
             success: false,
             message: "You are not authorized",
             error: `User role is ${decoded.role}`
        });
      }

      const userExist = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });

      //check if user is not exist
      if (!userExist) {
        return res.status(401).json({
             success: false,
             message: "You are not authorized",
             error: "This user is not existed"
        });
      }

      //check if the user is deleted
      if (userExist.isDeleted) {
        return res.status(401).json({
             success: false,
             message: "You are not authorized",
             error: 'This user is deleted'
         });
      }

      //check if the user is blocked
      const blockStatus = userExist.status;
      if (blockStatus === "blocked") {
        return res.status(401).json({
            success: false,
            message: "You are not authorized",
            error: 'This user is blocked'
        });
      }

      req.user = decoded;

      //set id & email to headers
      req.headers.email= decoded.email;
      req.headers.id= decoded.id;
     
      next()

    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: "You are not authorized",
        error: err.message,
      });
    }
  };
};

export default AuthMiddleware;

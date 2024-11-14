import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express"
import multer from "multer";


const globalErrorHandler = (err:any, req:Request, res: Response, next: NextFunction) : any => {
  let statusCode:number = err.statusCode || 500;
  let message:string = err.message || 'Something Went Wrong'

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 400;
      message = 'File size too large. Max limit is 1MB.';
     //return res.status(400).json({success: false, message: 'File size too large. Max limit is 1MB.', error: err });
    }
  }

  //prisma error handling
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 403;
    message = "validation error";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate Key error";
    }
  }
  
  return res.status(statusCode).json({
      success: false,
      message,
      error: err
    })
}


export default globalErrorHandler;
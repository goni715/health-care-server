import { NextFunction, Request, Response } from "express"
import multer from "multer";


const globalErrorHandler = (err:any, req:Request, res: Response, next: NextFunction) : any => {

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({success: false, message: 'File size too large. Max limit is 1MB.', error: err });
    }
  }
  
   return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Something Weng Wrong',
      error: err
    })
}


export default globalErrorHandler;
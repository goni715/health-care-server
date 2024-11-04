import { NextFunction, Request, Response } from "express"


const globalErrorHandler = (err:any, req:Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Something Weng Wrong',
      error: err
    })
}


export default globalErrorHandler;
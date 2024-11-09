import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res:Response, next:NextFunction) => {
        try{
            //parseData
            const parsedData = await schema.parseAsync({...req.body, ...req.cookies});
            req.body=parsedData
            next();
        }catch(err){
            next(err);
        }
    }
}


export default validateRequest;
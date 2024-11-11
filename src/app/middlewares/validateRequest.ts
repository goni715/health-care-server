import { NextFunction, Request, Response } from "express";
import { ZodEffects, ZodObject } from "zod";

const validateRequest = (schema: ZodObject<any> | ZodEffects<any>)=>{
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
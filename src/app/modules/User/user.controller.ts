import { Request, Response } from "express";
import { creatAdminService } from "./user.service";


const createAdmin = async (req: Request, res: Response) => {
  const result =  await creatAdminService(req.body);
  res.status(201).json(result);
}


export const userController = {
    createAdmin
}
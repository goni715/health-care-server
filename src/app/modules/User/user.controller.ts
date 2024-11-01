import { Request, Response } from "express";
import { creatAdminService } from "./user.service";


const createAdmin = async (req: Request, res: Response) => {
  const result =  await creatAdminService();
  res.status(201).json(result);
}


export const userController = {
    createAdmin
}
import { Request, Response } from "express";
import { creatAdminService } from "./user.service";


const createAdmin = async (req: Request, res: Response) => {
  try{
    const result =  await creatAdminService(req.file, req.body);
    res.status(201).json({
      success: true,
      message: "Admin is created successfully",
      data: result
    });
  }
  catch(err:any){
    res.status(500).json({
      success: false,
      message: err.message || 'Something Went Wrong',
      error: err
    })
  }
}


export const userController = {
    createAdmin
}
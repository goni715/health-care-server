import { Request, Response } from "express";
import { getAllAdminsService } from "./admin.service";


const getAllAdmins = async (req: Request, res: Response) => {
    try{
      const result =  await getAllAdminsService();
      res.status(200).json({
        success: true,
        message: "Admins are retrieved successfully",
        data: result
      });
    }
    catch(err:any){
      res.status(500).json({
        success: false,
        message: err.name || 'Something Went Wrong',
        error: err
      })
    }
  }
  
  
  export const adminController = {
      getAllAdmins
  }
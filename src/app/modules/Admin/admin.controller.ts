import { Request, Response } from "express";
import { getAllAdminsService } from "./admin.service";
import { AdminValidFields } from "./admin.constant";
import pickValidFields from "../../utils/pickValidFields";




const getAllAdmins = async (req: Request, res: Response) => {

    try{
      const validatedQuery = pickValidFields(req.query, AdminValidFields);
      console.log(validatedQuery);
      const result = await getAllAdminsService(validatedQuery);
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
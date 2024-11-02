import { Request, Response } from "express";
import { getAllAdminsService, getSingleAdminService } from "./admin.service";
import { AdminValidFields } from "./admin.constant";
import pickValidFields from "../../utils/pickValidFields";




const getAllAdmins = async (req: Request, res: Response) => {

    try{
      const validatedQuery = pickValidFields(req.query, AdminValidFields);
      const result = await getAllAdminsService(validatedQuery);
      res.status(200).json({
        success: true,
        message: "Admins are retrieved successfully",
        meta: result.meta,
        data: result.data
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
  


  const getSingleAdmin = async (req: Request, res: Response) => {

    const { id } = req.params;

    try{
      const result = await getSingleAdminService(id);
      res.status(200).json({
        success: true,
        message: "Admin is retrieved successfully",
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
      getAllAdmins,
      getSingleAdmin
  }
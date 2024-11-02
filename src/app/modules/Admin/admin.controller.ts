import { Request, Response } from "express";
import { deleteAdminService, getAllAdminsService, getSingleAdminService, softDeleteAdminService, updateAdminService } from "./admin.service";
import { AdminValidFields } from "./admin.constant";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";



const getAllAdmins = async (req: Request, res: Response) => {

    try{
      const validatedQuery = pickValidFields(req.query, AdminValidFields);
      const result = await getAllAdminsService(validatedQuery);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admins are retrieved successfully",
        meta: result.meta,
        data: result.data
      })
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

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin is retrieved successfully",
        data: result
      })
    }
    catch(err:any){
      res.status(500).json({
        success: false,
        message: err.name || 'Something Went Wrong',
        error: err
      })
    }
  }



  const updateAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await updateAdminService(id, req.body);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin is updated successfully",
        data: result
      })
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.name || "Something Went Wrong",
        error: err,
      });
    }
  };



  const deleteAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await deleteAdminService(id);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin is deleted successfully",
        data: result
      })
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.name || "Something Went Wrong",
        error: err,
      });
    }
  };


  const softDeleteAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await softDeleteAdminService(id);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin is deleted successfully",
        data: result
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.name || "Something Went Wrong",
        error: err,
      });
    }
  };



  
  export const adminController = {
      getAllAdmins,
      getSingleAdmin,
      updateAdmin,
      deleteAdmin,
      softDeleteAdmin
  }
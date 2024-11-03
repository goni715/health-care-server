import { NextFunction, Request, RequestHandler, Response } from "express";
import { deleteAdminService, getAllAdminsService, getSingleAdminService, softDeleteAdminService, updateAdminService } from "./admin.service";
import { AdminValidFields } from "./admin.constant";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";




const getAllAdmins = catchAsync(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, AdminValidFields);
    const result = await getAllAdminsService(validatedQuery);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admins are retrieved successfully",
      meta: result.meta,
      data: result.data
    })
})
  


  const getSingleAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await getSingleAdminService(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin is retrieved successfully",
      data: result,
    });
  });



  const updateAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await updateAdminService(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin is updated successfully",
      data: result,
    });
  });



  const deleteAdmin = async (req: Request, res: Response,  next:NextFunction) => {
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
      next(err)
    }
  };


  const softDeleteAdmin = async (req: Request, res: Response,  next:NextFunction) => {
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
      next(err)
    }
  };



  
  export const adminController = {
      getAllAdmins,
      getSingleAdmin,
      updateAdmin,
      deleteAdmin,
      softDeleteAdmin
  }
import { Request, Response } from "express";
import { createAdminService, createDoctorService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";


const createAdmin = async (req: Request, res: Response) => {
  try{
    const result =  await createAdminService(req.file, req.body);
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



const createDoctor = catchAsync(async (req, res) => {
  const result =  await createDoctorService(req.file, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor is created successfully",
    data: result
  })
})




export const UserController = {
    createAdmin,
    createDoctor
}
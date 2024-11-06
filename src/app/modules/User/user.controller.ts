import { Request, Response } from "express";
import { changeStatusService, createAdminService, createDoctorService, createPatientService, getAllUsersService, getMyProfileService, updateMyProfilePhotoService, updateMyProfileService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import pickValidFields from "../../utils/pickValidFields";
import { UserValidFields } from "./user.constant";
import { UserRole } from "@prisma/client";
import { TUpdateProfile } from "./user.interface";



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


const createPatient = catchAsync(async (req, res) => {
  const result =  await createPatientService(req.file, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient is created successfully",
    data: result
  })
})



const getAllUsers = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, UserValidFields);
  const result = await getAllUsersService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users are retrieved successfully",
    meta: result.meta,
    data: result.data
  })
})


const changeStatus = catchAsync(async (req, res) => {
  const {id} = req.params;
  const result = await changeStatusService(id, req.body);
  res.status(200).json({
    status: true,
    message: 'Status is updated successfully',
    data: result
  });
});




const getMyProfile = catchAsync(async (req, res) => {
  const { email, role } = req.headers;
  const result = await getMyProfileService(email as string, role as UserRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Profile is retrieved successfully",
    data: result,
  });
});


const updateMyProfile = catchAsync(async (req, res) => {
  const { email, role } = req.headers;
  const result = await updateMyProfileService(email as string, role as UserRole, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Profile is updated successfully",
    data: result,
  });
});


const updateMyProfilePhoto = catchAsync(async (req, res) => {
  const { email, role } = req.headers;
  const result = await updateMyProfilePhotoService(req.file, email as string, role as UserRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Profile Photo is updated successfully",
    data: result,
  });
});



export const UserController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    changeStatus,
    getMyProfile,
    updateMyProfile,
    updateMyProfilePhoto
}
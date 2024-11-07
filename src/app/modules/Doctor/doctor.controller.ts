import { NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { DoctorValidFields } from "./doctor.constant";
import { deleteDoctorService, getAllDoctorsService, getSingleDoctorService, softDeleteDoctorService, updateDoctorService } from "./doctor.service";


const getAllDoctors = catchAsync(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, DoctorValidFields);
    const result = await getAllDoctorsService(validatedQuery);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctors are retrieved successfully",
      meta: result.meta,
      data: result.data
    })
})
  


const getSingleDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleDoctorService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor is retrieved successfully",
    data: result,
  });
});



const deleteDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteDoctorService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor is deleted successfully",
    data: result,
  });

})


const softDeleteDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await softDeleteDoctorService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor is deleted successfully",
    data: result,
  });
})



const updateDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateDoctorService(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor is updated successfully",
    data: result,
  });
})



export const DoctorController = {
    getAllDoctors,
    getSingleDoctor,
    deleteDoctor,
    softDeleteDoctor,
    updateDoctor
}
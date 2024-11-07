import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { SpecialtiesValidFields } from "./specialties.constant";
import { createSpecialtiesService, getAllSpecialtiesService } from "./specialties.service";

const createSpecialties = catchAsync(async (req, res) => {
    const result =  await createSpecialtiesService(req.file, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Specialties created successfully",
      data: result
    })
  })



  const getAllSpecialties = catchAsync(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, SpecialtiesValidFields);
    const result = await getAllSpecialtiesService(validatedQuery);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Specialties are retrieved successfully",
      meta: result.meta,
      data: result.data
    })
  })
  
  

  export const SpecialtiesController = {
    createSpecialties,
    getAllSpecialties
  }
import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { SpecialtiesValidFields } from "./specialties.constant";
import { createSpecialtiesService, deleteSpecialtiesService, getAllSpecialtiesService } from "./specialties.service";

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
  


  const deleteSpecialties = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await deleteSpecialtiesService(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Specialties deleted successfully",
      data: result
    })
  })
  
  

  export const SpecialtiesController = {
    createSpecialties,
    getAllSpecialties,
    deleteSpecialties
  }
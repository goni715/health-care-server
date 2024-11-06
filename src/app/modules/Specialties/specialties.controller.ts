import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createSpecialtiesService } from "./specialties.service";

const createSpecialties = catchAsync(async (req, res) => {
    const result =  await createSpecialtiesService(req.file, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Specialties created successfully",
      data: result
    })
  })
  

  export const SpecialtiesController = {
    createSpecialties
  }
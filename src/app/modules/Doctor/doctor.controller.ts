import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { DoctorValidFields } from "./doctor.constant";
import { getAllDoctorsService } from "./doctor.service";


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
  

export const DoctorController = {
    getAllDoctors
}
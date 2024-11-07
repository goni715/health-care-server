import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { PatientValidFields } from "./patient.constant";
import { getAllPatientsService } from "./patient.service";


const getAllPatients = catchAsync(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, PatientValidFields);
    const result = await getAllPatientsService(validatedQuery);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Patients are retrieved successfully",
      meta: result.meta,
      data: result.data
    })
})
  

export const PatientController = {
    getAllPatients
}
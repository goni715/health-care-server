import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createPatientHealthDataService } from "./patientHealthData.service";

const createPatientHealthData = catchAsync(async (req, res) => {
  const result = await createPatientHealthDataService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient Health Data created successfully",
    data: result,
  });
});


export const PatientHealthDataController = {
    createPatientHealthData
}

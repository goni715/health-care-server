import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createPatientHealthDataService, updatePatientHealthDataService } from "./patientHealthData.service";

const createPatientHealthData = catchAsync(async (req, res) => {
  const result = await createPatientHealthDataService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient Health Data created successfully",
    data: result,
  });
});


const updatePatientHealthData = catchAsync(async (req, res) => {
  const { patientId } = req.params;
  const result = await updatePatientHealthDataService(patientId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient Health Data updated successfully",
    data: result,
  });
})




export const PatientHealthDataController = {
    createPatientHealthData,
    updatePatientHealthData
}

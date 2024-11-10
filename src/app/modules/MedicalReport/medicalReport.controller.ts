import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createMedicalReportService, deleteMedicalReportService } from "./medicalReport.service";

const createMedicalReport = catchAsync(async (req, res) => {
  const result = await createMedicalReportService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Medical Report created successfully",
    data: result,
  });
});


const deleteMedicalReport = catchAsync(async (req, res) => {
  const { patientId, reportId } = req.params;
  const result = await deleteMedicalReportService(patientId, reportId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Medical Report deleted successfully",
    data: result,
  });
});



export const MedicalReportController = {
   createMedicalReport,
   deleteMedicalReport
}

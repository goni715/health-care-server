import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createMedicalReportService } from "./medicalReport.service";

const createMedicalReport = catchAsync(async (req, res) => {
  const result = await createMedicalReportService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Medical Report created successfully",
    data: result,
  });
});




export const MedicalReportController = {
   createMedicalReport
}

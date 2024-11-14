import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createPrescriptionService } from "./prescription.service";

const createPrescription = catchAsync(async (req, res) => {
  const { email } = req.headers;
  const result = await createPrescriptionService(email as string, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Prescription is created successfully",
    data: result,
  });
});




export const PrescriptionController = {
    createPrescription
}

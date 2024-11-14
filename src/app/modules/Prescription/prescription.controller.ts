import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { PrescriptionFields } from "./patient.constant";
import { createPrescriptionService, getAllPrescriptionService, getMyPrescriptionService } from "./prescription.service";

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



const getMyPrescription = catchAsync(async (req, res) => {
  const { email, role } = req.headers;
  const validatedQuery = pickValidFields(req.query, PrescriptionFields)
  const result = await getMyPrescriptionService(email as string, role as string, validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Prescriptions are retrieved successfully",
    meta: result.meta,
    data: result.data
  })
})


const getAllPrescriptions = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, PrescriptionFields)
  const result = await getAllPrescriptionService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Prescriptions are retrieved successfully",
    meta: result.meta,
    data: result.data
  })
})



export const PrescriptionController = {
    createPrescription,
    getMyPrescription,
    getAllPrescriptions
}

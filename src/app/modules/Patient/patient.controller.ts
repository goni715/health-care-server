import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { PatientValidFields } from "./patient.constant";
import { deletePatientService, getAllPatientsService, getSinglePatientService, softDeletePatientService, updatePatientService } from "./patient.service";


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
  


const getSinglePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSinglePatientService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient is retrieved successfully",
    data: result,
  });
});



const deletePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deletePatientService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient is deleted successfully",
    data: result,
  });

})


const softDeletePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await softDeletePatientService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient is deleted successfully.. soft",
    data: result,
  });
})

const updatePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updatePatientService(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient is updated successfully",
    data: result,
  });
})


export const PatientController = {
    getAllPatients,
    getSinglePatient,
    deletePatient,
    softDeletePatient,
    updatePatient
}
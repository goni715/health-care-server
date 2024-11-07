import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";


const getAllDoctors = catchAsync(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, AdminValidFields);
    const result = await getAllAdminsService(validatedQuery);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admins are retrieved successfully",
      meta: result.meta,
      data: result.data
    })
})
  

export const DoctorController = {
    getAllDoctors
}
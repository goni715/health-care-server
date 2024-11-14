import { Request } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { fetchMetaDataService } from "./meta.service";
import { IAuthUser } from "../../interfaces/common.interface";

const fetchDashboardMetaData = catchAsync(async (req: Request & {user?: IAuthUser}, res) => {
    const user = req.user;
    const result = await fetchMetaDataService(user as IAuthUser);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Meta data retrieved successfully",
      data: result
    })
  
 
})
  
  
  
  
  
  export const MetaController = {
      fetchDashboardMetaData
  }
  
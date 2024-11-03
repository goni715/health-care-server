import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { loginUserService } from "./auth.service";


const loginUser = catchAsync(async(req, res)=> {
    const result = await loginUserService(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User login successfully',
        data: result
    })
})


export const AuthController = {
    loginUser
}
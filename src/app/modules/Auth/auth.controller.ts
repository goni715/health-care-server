import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { loginUserService } from "./auth.service";


const loginUser = catchAsync(async(req, res)=> {
    const result = await loginUserService(req.body);
    const { accessToken, refreshToken, needPasswordChange} = result;

    //set refreshToken on-cookie
    res.cookie('refreshToken', refreshToken, {
        secure: config.Node_Env === "production", //true-https or false-http
        httpOnly: true,
    })


    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User login successfully',
        data: {
            accessToken,
            needPasswordChange
        }
    })
})


export const AuthController = {
    loginUser
}
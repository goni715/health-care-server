import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { changePasswordService, forgotPasswordService, loginUserService, refreshTokenService } from "./auth.service";


const loginUser = catchAsync(async(req, res)=> {
    const result = await loginUserService(req.body);
    const { accessToken, refreshToken, needPasswordChange} = result;

    //set refreshToken on-cookie
    res.cookie('refreshToken', refreshToken, {
        secure: config.Node_Env === "development", //true-https or false-http
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





//get new accessToken by refreshToken
const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await refreshTokenService(refreshToken);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Access token is retrieved successfully !',
        data: result
    })
})



const changePassword = catchAsync(async (req, res) => {
    const { id } = req.headers;
    const result = await changePasswordService(id as string, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Password is updated successfully !',
        data: result
    })
})




const forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const result = await forgotPasswordService(email);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Reset link is sent successfully !',
        data: result
    })
})


export const AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword
}
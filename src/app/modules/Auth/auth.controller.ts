import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { loginUserService, refreshTokenService } from "./auth.service";


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



export const AuthController = {
    loginUser,
    refreshToken
}
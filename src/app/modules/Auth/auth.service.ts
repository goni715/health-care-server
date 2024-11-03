import config from "../../config";
import prisma from "../../shared/prisma"
import createToken from "../../utils/createToken";
import { TLoginUser } from "./auth.interface";
import bcrypt from 'bcryptjs';


const loginUserService = async(payload:TLoginUser) => {
    const userData = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    })

    if(!userData){
        throw new Error('Could not find this email!')
    }

    //check password
    const isPasswordMatch: boolean = await bcrypt.compare(payload.password, userData.password); //return true or false
    if(!isPasswordMatch){
        throw new Error('Wrong Password!')
    }

    //token-payload
    const jwtPayload =  {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    }

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    );




    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    }

}

export {
    loginUserService
}
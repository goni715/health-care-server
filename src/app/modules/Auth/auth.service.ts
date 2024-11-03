import prisma from "../../shared/prisma"
import { TLoginUser } from "./auth.interface";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


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


    const accessToken = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        role: userData.role,
      },
      "secretKey",
      { algorithm: "HS256", expiresIn: "1h" }
    );


    const refreshToken = jwt.sign(
        {
          id: userData.id,
          email: userData.email,
          role: userData.role,
        },
        "secretKeyRefresh",
        { algorithm: "HS256", expiresIn: "10d" }
      );

      //console.log(accessToken);
      const decoded = jwt.verify(accessToken, 'secretKey');
      console.log(decoded);


    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    }

}

export {
    loginUserService
}
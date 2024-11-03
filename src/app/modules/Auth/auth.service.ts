import prisma from "../../shared/prisma"
import { TLoginUser } from "./auth.interface";
import bcrypt from 'bcryptjs';


const loginUserService = async(payload:TLoginUser) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
        }
    })


    const isPasswordMatch: boolean = await bcrypt.compare(payload.password, userData.password);
    console.log(isPasswordMatch);

    return userData;

}

export {
    loginUserService
}
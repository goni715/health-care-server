import { PrismaClient, UserRole } from "@prisma/client";
import hashedPassword from "../../utils/hashedPassword";

const prisma = new PrismaClient()


const creatAdminService = async ( payload:any ) => {

    const userData = {
        email: payload.adminData.email,
        password: await hashedPassword(payload.password),
        role: UserRole.admin
    }


    const result = await prisma.$transaction( async(transactionClient)=>{
        //query-01
        const createUser = await transactionClient.user.create({
            data: userData
        })

        //query-02
        const createAdmin = await transactionClient.admin.create({
            data: payload.adminData
        })

        return {
            createUser,
            createAdmin
        }
    })

     return result;
}


export {
    creatAdminService
}
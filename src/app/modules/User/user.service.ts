import { PrismaClient, UserRole } from "@prisma/client";
import hashedPassword from "../../utils/hashedPassword";
import { TAdmin } from "../Admin/admin.interface";

const prisma = new PrismaClient()


const creatAdminService = async (payload: TAdmin) => {
  const userData = {
    email: payload.adminData.email,
    password: await hashedPassword(payload.password),
    role: UserRole.admin,
  };

  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.adminData.email,
    },
  });

  //check email is already exist
  if (userExist) {
    console.log("user");
    throw new Error("This email is already existed");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    //query-01
    const createUser = await transactionClient.user.create({
      data: userData,
    });

    //query-02
    const createAdmin = await transactionClient.admin.create({
      data: payload.adminData,
    });

    return {
      createUser,
      createAdmin,
    };
  });

  return result.createAdmin;
};


export {
    creatAdminService
}
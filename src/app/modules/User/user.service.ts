import { PrismaClient, UserRole } from "@prisma/client";
import hashedPassword from "../../utils/hashedPassword";
import { TAdmin } from "../Admin/admin.interface";
import uploadImageToCloudinary from "../../utils/uploadImageToCloudinary";

const prisma = new PrismaClient()


const createAdminService = async (file:any, payload: TAdmin) => {
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
    throw new Error("This email is already existed");
  }


    //if there is a file -- upload image to cloudinary
    if (file) {
      const cloudinaryRes = await uploadImageToCloudinary(file?.path);
      payload.adminData.profilePhoto = cloudinaryRes?.secure_url;
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


const createDoctorService = async (file:any, payload: TAdmin) => {
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
    throw new Error("This email is already existed");
  }


    //if there is a file -- upload image to cloudinary
    if (file) {
      const cloudinaryRes = await uploadImageToCloudinary(file?.path);
      payload.adminData.profilePhoto = cloudinaryRes?.secure_url;
    }

  // const result = await prisma.$transaction(async (transactionClient) => {
  //   //query-01
  //   const createUser = await transactionClient.user.create({
  //     data: userData,
  //   });

  //   //query-02
  //   const createAdmin = await transactionClient.admin.create({
  //     data: payload.adminData,
  //   });

  //   return {
  //     createUser,
  //     createAdmin,
  //   };
  // });

  //return result.createAdmin;
  return payload
};


export {
    createAdminService,
    createDoctorService
}
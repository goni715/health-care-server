import { PrismaClient } from "@prisma/client";
import uploadImageToCloudinary from "../../utils/uploadImageToCloudinary";
import { TSpecialties } from "./specialties.interface"

const prisma = new PrismaClient()

const createSpecialtiesService = async(file: Express.Multer.File | undefined, payload: TSpecialties) => {

    const specialtiesExist = await prisma.specialties.findUnique({
        where: {
            title: payload.title
        }
    })
    
      //check email is already exist
      if (specialtiesExist) {
        throw new Error("This Title is already existed");
      }
    
      //if there is a file -- upload image to cloudinary
      if (file) {
        const cloudinaryRes = await uploadImageToCloudinary(file?.path);
        payload.icon = cloudinaryRes?.secure_url;
      }

    const createdData = await prisma.specialties.create({
        data: payload
    })

    return createdData
}




export {
    createSpecialtiesService
}
import { Prisma, PrismaClient } from "@prisma/client";
import uploadImageToCloudinary from "../../utils/uploadImageToCloudinary";
import { TSpecialties, TSpecialtiesQuery } from "./specialties.interface"
import calculatePagination from "../../utils/calculatePagination";
import { SpecialtiesSearchableFields } from "./specialties.constant";
import ApiError from "../../errors/ApiError";

const prisma = new PrismaClient();

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



const getAllSpecialtiesService = async (query: TSpecialtiesQuery) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...filterData } = query;
  let conditions: Record<string, unknown> = {}
  const searchQuery = SpecialtiesSearchableFields.map((item) => ({
    [item]: {
      contains: query?.searchTerm,
      mode: "insensitive",
    },
  }));

  const pagination = calculatePagination({ page, limit, sortBy, sortOrder });
 

  if (query?.searchTerm) {
    conditions.OR = searchQuery
  }
  

  const result = await prisma.specialties.findMany({
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: {
      [pagination.sortBy]: pagination.sortOrder,
    },
  });

  const total = await prisma.specialties.count({
    where: conditions
  });




  return {
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
      total,
    },
    data: result,
  };
};


const deleteSpecialtiesService = async (id: string) => {
  //if id is not exist
  const dataExist = await prisma.specialties.findUnique({
    where: {
      id,
    },
  });

  if (!dataExist) {
    throw new ApiError(404, "This id does not exist");
  }

  //delete specialities
  await prisma.specialties.delete({
    where: {
      id,
    },
  });

  return null;
};



export {
    createSpecialtiesService,
    getAllSpecialtiesService,
    deleteSpecialtiesService
}
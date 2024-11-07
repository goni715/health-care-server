import { Prisma, PrismaClient } from "@prisma/client";
import uploadImageToCloudinary from "../../utils/uploadImageToCloudinary";
import { TSpecialties, TSpecialtiesQuery } from "./specialties.interface";
import { SpecialtiesSearchableFields } from "./specialties.constant";
import ApiError from "../../errors/ApiError";
import findPublicId from "../../helper/findPublicId";
import cloudinary from "../../helper/cloudinary";
import { calculatePaginationSorting } from "../../helper/QueryBuilder";

const prisma = new PrismaClient();

const createSpecialtiesService = async (
  file: Express.Multer.File | undefined,
  payload: TSpecialties
) => {
  const specialtiesExist = await prisma.specialties.findUnique({
    where: {
      title: payload.title,
    },
  });

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
    data: payload,
  });

  return createdData;
};

const getAllSpecialtiesService = async (query: TSpecialtiesQuery) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...filterData } = query;
  let conditions: Record<string, unknown> = {};
  const searchQuery = SpecialtiesSearchableFields.map((item) => ({
    [item]: {
      contains: query?.searchTerm,
      mode: "insensitive",
    },
  }));

  const pagination = calculatePaginationSorting({ page, limit, sortBy, sortOrder });

  if (query?.searchTerm) {
    conditions.OR = searchQuery;
  }

  const result = await prisma.specialties.findMany({
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: {
      [pagination.sortBy]: pagination.sortOrder,
    },
  });

  const total = await prisma.specialties.count({
    where: conditions,
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

const updateIconService = async (
  file: Express.Multer.File | undefined,
  id: string
) => {
  //check if the file is not exist
  if (!file) {
    throw new ApiError(400, "File is required");
  }

  const dataExist = await prisma.specialties.findUnique({
    where: {
      id,
    },
  });

  //if specialties does not exist
  if (!dataExist) {
    throw new ApiError(404, "This id does not exist");
  }

  //image upload to cloudinary
  const cloudinaryRes = await uploadImageToCloudinary(file?.path);
  const icon = cloudinaryRes?.secure_url;

  const updatedData = await prisma.specialties.update({
    where: {
      id,
    },
    data: {
      icon,
    },
  });

  //delete image from cloudinary
  if (dataExist.icon) {
    const public_id = findPublicId(dataExist.icon);
    await cloudinary.uploader.destroy(public_id);
  }

  return updatedData;
};

export {
  createSpecialtiesService,
  getAllSpecialtiesService,
  deleteSpecialtiesService,
  updateIconService,
};

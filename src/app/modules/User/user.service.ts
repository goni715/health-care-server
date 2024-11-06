import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import hashedPassword from "../../utils/hashedPassword";
import { TAdmin } from "../Admin/admin.interface";
import uploadImageToCloudinary from "../../utils/uploadImageToCloudinary";
import { TDoctor } from "../Doctor/doctor.interface";
import { TPatient } from "../Patient/patient.interface";
import { TUserQuery } from "./user.interface";
import { UserSearchableFields } from "./user.constant";
import calculatePagination from "../../utils/calculatePagination";

const prisma = new PrismaClient();

const createAdminService = async (file: any, payload: TAdmin) => {
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

const createDoctorService = async (file: any, payload: TDoctor) => {
  const userData = {
    email: payload.doctorData.email,
    password: await hashedPassword(payload.password),
    role: UserRole.doctor,
  };

  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.doctorData.email,
    },
  });

  //check email is already exist
  if (userExist) {
    throw new Error("This email is already existed");
  }

  //if there is a file -- upload image to cloudinary
  if (file) {
    const cloudinaryRes = await uploadImageToCloudinary(file?.path);
    payload.doctorData.profilePhoto = cloudinaryRes?.secure_url;
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    //query-01
    const createUser = await transactionClient.user.create({
      data: userData,
    });

    //query-02
    const createDoctor = await transactionClient.doctor.create({
      data: payload.doctorData,
    });
    return {
      createUser,
      createDoctor,
    };
  });

  return result.createDoctor;
};

const createPatientService = async (file: any, payload: TPatient) => {
  const userData = {
    email: payload.patientData.email,
    password: await hashedPassword(payload.password),
    role: UserRole.patient,
  };

  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.patientData.email,
    },
  });

  //check email is already exist
  if (userExist) {
    throw new Error("This email is already existed");
  }

  //if there is a file -- upload image to cloudinary
  if (file) {
    const cloudinaryRes = await uploadImageToCloudinary(file?.path);
    payload.patientData.profilePhoto = cloudinaryRes?.secure_url;
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    //query-01
    const createdUser = await transactionClient.user.create({
      data: userData,
    });

    //query-02
    const createdPatient = await transactionClient.patient.create({
      data: payload.patientData,
    });
    return {
      createdUser,
      createdPatient,
    };
  });

  return result.createdPatient;
};

const getAllUsersService = async (query: TUserQuery) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...filterData } = query;
  const andConditions: Prisma.UserWhereInput[] = [];
  const searchQuery = UserSearchableFields.map((item) => ({
    [item]: {
      contains: query?.searchTerm,
      mode: "insensitive",
    },
  }));

  const pagination = calculatePagination({ page, limit, sortBy, sortOrder });

  if (query?.searchTerm) {
    andConditions.push({
      OR: searchQuery,
    });
  }

  //filter-condition for specific field
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // whereConditions
  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: {
      [pagination.sortBy]: pagination.sortOrder,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      // admin: true,
      // doctor: true,
      // patient: true
    },
    // include: {
    //   admin: true,
    //   doctor: true,
    //   patient: true,
    // },
  });

  const total = await prisma.user.count({
    where: whereConditions,
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

const changeStatusService = async (
  id: string,
  payload: { status: "active" | "blocked" }
) => {
  const userExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  //check email is already exist
  if (!userExist) {
    throw new Error("User Not Found");
  }

  //update status
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const getMyProfileService = async (email: string, role: UserRole) => {

  const user = await prisma.user.findUnique({
    where :{
      email
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  })


  let profileData;

  //if role is admin
  if (role === "admin") {
    profileData = await prisma.admin.findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        profilePhoto: true,
        contactNumber:true
     }
    });
  }

  //if role is doctor
  if (role === "doctor") {
    profileData = await prisma.doctor.findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        profilePhoto: true,
        contactNumber: true,
        address: true,
        registrationNumber: true,
        experience: true,
        gender: true,
        appointmentFee: true,
        qualification: true,
        currentWorkingPlace: true,
        designation: true,
      },
    });
  }

  //if role is patient
  if (role === "patient") {
    profileData = await prisma.patient.findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        profilePhoto: true,
        contactNumber:true,
        address: true
     }
    });
  }



  return {
    ...user,
    ...profileData
  };
};

export {
  createAdminService,
  createDoctorService,
  createPatientService,
  getAllUsersService,
  changeStatusService,
  getMyProfileService,
};

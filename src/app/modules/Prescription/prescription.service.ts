import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { calculatePaginationSorting, makeSearchQuery } from "../../helper/QueryBuilder";
import { TPrescriptionQuery } from "./prescription.interface";
import { PrescriptionSearchableFields } from "./patient.constant";

const createPrescriptionService = async (
  email: string,
  payload: Prescription
) => {
  const appointmentExist = await prisma.appointment.findUnique({
    where: {
      id: payload.appointmentId,
    },
    include: {
      doctor: true,
    },
  });

  //check if appointmentId does not exist
  if (!appointmentExist) {
    throw new ApiError(404, "This appointmentId does not exist");
  }

  if (appointmentExist.doctor.email !== email) {
    throw new ApiError(404, "This appointment does not belong to this doctor");
  }

  //check if appointmentStatus is not completed
  if (appointmentExist.status !== "COMPLETED") {
    throw new ApiError(400, "This appointment is not completed");
  }

  if (appointmentExist.paymentStatus !== "PAID") {
    throw new ApiError(400, "Payment is unpaid");
  }

  const prescriptionExist = await prisma.prescription.findUnique({
    where: {
      appointmentId: payload.appointmentId,
    },
  });

  if (prescriptionExist) {
    throw new ApiError(
      409,
      "Prescription already exist with this appointmentId"
    );
  }

  //set doctorId & patientId
  payload.doctorId = appointmentExist.doctorId;
  payload.patientId = appointmentExist.patientId;

  const result = await prisma.prescription.create({
    data: payload,
  });

  return result;
};

const getMyPrescriptionService = async (
  email: string,
  role: string,
  query: TPrescriptionQuery
) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...filters } = query;

  let filterQuery: any[] = [];
  let searchQuery = {};

  //if role is doctor
  if (role === "doctor") {
    filterQuery.push({
      doctor: {
        email: email,
      },
    });

    if (filters.email) {
      filterQuery.push({
        patient: {
          email: filters.email,
        },
      });
    }

    if (searchTerm) {
      searchQuery = {
        patient: {
          OR: makeSearchQuery(PrescriptionSearchableFields, searchTerm),
        },
      };
    }
  }

  //if role is patient
  if (role === "patient") {
    filterQuery.push({
      patient: {
        email: email,
      },
    });

    if (filters.email) {
      filterQuery.push({
        doctor: {
          email: filters.email,
        },
      });
    }

    if (searchTerm) {
      searchQuery = {
        doctor: {
          OR: makeSearchQuery(PrescriptionSearchableFields, searchTerm),
        },
      };
    }
  }

  //console.dir(filterQuery, {depth: Infinity});

  // Build the 'where' clause based on search and filter
  const whereConditions: any = {
    AND: filterQuery,
    ...searchQuery,
  };

  // Calculate pagination values & sorting
  const pagination = calculatePaginationSorting({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const result = await prisma.prescription.findMany({
    where: whereConditions,
    skip: pagination.skip,
    take: pagination.limit,
    include: {
      doctor: true,
      patient: true,
    },
  });

  // Count total with matching the criteria
  const total = await prisma.prescription.count({
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

export { createPrescriptionService, getMyPrescriptionService };

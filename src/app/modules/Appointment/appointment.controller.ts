import { Request } from "express";
import { IAuthUser } from "../../interfaces/common.interface";
import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { AppointmentValidFields } from "./appointment.constant";
import {
  changeAppointmentStatusService,
  changePaymentStatusService,
  createAppointmentService,
  getAllAppointmentService,
  getMyAppointmentService,
} from "./appointment.service";

const createAppointment = catchAsync(async (req, res) => {
  const { email } = req.headers;
  const result = await createAppointmentService(email as string, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Appointment Booked successfully",
    data: result,
  });
});

const getMyAppointments = catchAsync(async (req, res) => {
  const { email, role } = req.headers;
  const validatedQuery = pickValidFields(req.query, AppointmentValidFields);
  const result = await getMyAppointmentService(
    email as string,
    role as string,
    validatedQuery
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointments are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAllAppointments = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, AppointmentValidFields);
  const result = await getAllAppointmentService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointments are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const changeAppointmentStatus = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await changeAppointmentStatusService(
      id,
      req.body,
      user as IAuthUser
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointment Status is updated successfully",
      data: result,
    });
  }
);

const changePaymentStatus = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    const { id } = req.params;
    const result = await changePaymentStatusService(id, req.body.status);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointment Payment Status updated successfully",
      data: result,
    });
  }
);

export const AppointmentController = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  changeAppointmentStatus,
  changePaymentStatus,
};

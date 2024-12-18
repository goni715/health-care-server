import { AppointmentStatus, PaymentStatus } from "@prisma/client";

export type TAppointment = {
    patientId: string;
    doctorId: string,
    scheduleId: string,
    videoCallingId: string;
}



export type TAppointmentQuery = {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    paymentStatus?: string;
};
  

export type TUpdateStatus = {
    status: AppointmentStatus
}

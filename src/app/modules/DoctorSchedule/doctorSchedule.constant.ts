export const DoctorScheduleValidFields: string[] = [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "startDate",
    "endDate",
    "isBooked"
  ];


  
export type TDoctorScheduleQuery = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  isBooked?: string;
};


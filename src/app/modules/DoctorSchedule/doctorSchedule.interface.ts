

export type TDoctorSchedule = {
    schedules: string[]
}

  
export type TDoctorScheduleQuery = {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
    isBooked?: string;
};
  
  
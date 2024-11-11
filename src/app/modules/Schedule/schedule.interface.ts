export type TSchedule = {
  startDate: string;
  endDate: string
  startTime: string
  endTime: string
};


export type TScheduleQuery = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
};

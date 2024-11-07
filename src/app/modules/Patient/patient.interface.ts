export type TPatient = {
    password: string;
    patientData: {
      name: string;
      email: string;
      contactNumber: string,
      profilePhoto?: string;
      address?: string;
   };
};

export type TPatientQuery = {
   searchTerm?: string;
   page?: string;
   limit?: string;
   sortBy?: string;
   sortOrder?: 'asc' | 'desc';
   name?: string;
   email?: string;
   contactNumber?: string;
 };
 
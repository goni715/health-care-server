export type TUserQuery = {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
    email?: string;
    role?: string;
    status?: string;
  };
  

  export type TUpdateProfile = {
    adminData?: {
      name?: string;
      contactNumber?: string;
    };
    doctorData?: {
      name?: string;
      contactNumber?: string;
      profilePhoto?: string;
      address?: string;
      registrationNumber?: string;
      experience?: number;
      gender?: "male" | "female";
      appointmentFee?: number;
      qualification?: string;
      currentWorkingPlace?: string;
      designation?: string;
    };
    patientData?: {
      name?: string;
      contactNumber?: string;
      profilePhoto?: string;
      address?: string;
    };
  };
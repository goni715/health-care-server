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
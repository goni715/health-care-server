
export type TDoctor = {
    password: string;
    doctorData: {
      name: string;
      email: string;
      contactNumber: string,
      profilePhoto?: string;
      address?: string;
      registrationNumber: string;
      experience: number;
      gender: 'male' | 'female';
      appointmentFee: number;
      qualification: string;
      currentWorkingPlace: string;
      designation: string;
   };
};
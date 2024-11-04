export type TAdminQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder: string;
  name?: string;
  email?: string;
  contactNumber?: string;
};



export type TAdmin = {
  password: string;
  adminData: {
    name: string
    email: string
    contactNumber: string
  };
};

export interface Admin {

  _id: string;

  name: string;
  username?: string;

  email: string;

  role:
    | "SUPER_ADMIN"
    | "ADMIN";

  status:
    | "ACTIVE"
    | "INACTIVE";

  createdAt: string;

  updatedAt?: string;
  lastLogin?: string;

}

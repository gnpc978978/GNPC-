export interface Sponsor {
  _id?: string;

  name: string;

  logo?: string;

  website: string;

  displayOrder: number;

  status: "ACTIVE" | "INACTIVE";

  createdAt?: string;

  updatedAt?: string;
}
export interface Member {
  _id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  organization?: string;
  state?: string;
  photo: string;
  displayOrder: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MemberFormData {
  name: string;
  designation: string;
  email: string;
  phone: string;
  organization?: string;
  state?: string;
  photo: File | string | null;
  displayOrder: number;
  status: "active" | "inactive";
}

export interface MembersStats { total: number; active: number; inactive: number; }
export interface ImportFailure { row: number; reason: string; }
export interface ImportSummary { totalRows: number; imported: number; failed: number; failedRows: ImportFailure[]; }
export interface PaginatedMembers { data: Member[]; pagination: { page: number; limit: number; total: number; pages: number }; }

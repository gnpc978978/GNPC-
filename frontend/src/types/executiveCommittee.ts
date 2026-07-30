export interface ExecutiveCommittee {
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

export interface ExecutiveCommitteeFormData {
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

export interface ExecutiveCommitteeStats { total: number; active: number; inactive: number; }
export interface ImportFailure { row: number; reason: string; }
export interface ImportSummary { totalRows: number; imported: number; failed: number; failedRows: ImportFailure[]; }
export interface PaginatedMembers { data: ExecutiveCommittee[]; pagination: { page: number; limit: number; total: number; pages: number }; }

export interface OfficeBearer { _id: string; fullName: string; photo: string; email?: string; phone?: string; designation?: string; organization?: string; state?: string; district?: string; displayOrder: number; createdAt: string; updatedAt: string; }
export interface OfficeBearerFormData { fullName: string; photo?: File | null; email?: string; phone?: string; designation?: string; organization?: string; state?: string; district?: string; displayOrder: number; }
export interface OfficeBearerListResponse { data: OfficeBearer[]; pagination: { page: number; limit: number; total: number; pages: number }; stats?: { total: number; active: number }; }
export interface ImportSummary { totalRows: number; imported: number; failed: number; failedRows: { row: number; reason: string }[]; }

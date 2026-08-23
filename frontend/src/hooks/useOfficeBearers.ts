import { useQuery } from "@tanstack/react-query";
import { getOfficeBearer, getPublicOfficeBearers, type OfficeBearerDirectoryFilters } from "@/services/officeBearersService";

export const usePublicOfficeBearers = (page: number, limit: number, filters: OfficeBearerDirectoryFilters = {}, all = false) => useQuery({ queryKey: ["office-bearers", "public", page, limit, filters, all], queryFn: () => getPublicOfficeBearers(page, limit, filters, all) });
export const useOfficeBearer = (id: string) => useQuery({ queryKey: ["officeBearers", id], queryFn: () => getOfficeBearer(id), enabled: Boolean(id) });

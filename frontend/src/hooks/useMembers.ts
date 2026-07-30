import { useQuery } from "@tanstack/react-query";
import { getMember, getPublicMembers, type MemberDirectoryFilters } from "@/services/member.service";

export const usePublicMembers = (page: number, limit: number, filters: MemberDirectoryFilters = {}, all = false) => useQuery({ queryKey: ["office-bearers", "public", page, limit, filters, all], queryFn: () => getPublicMembers(page, limit, filters, all) });
export const useMember = (id: string) => useQuery({ queryKey: ["members", id], queryFn: () => getMember(id), enabled: Boolean(id) });

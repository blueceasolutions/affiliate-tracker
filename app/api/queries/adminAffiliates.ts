import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getAffiliates } from "../../lib/api";

export const adminAffiliatesKey = "admin-affiliates";
export const adminAffiliatesQuery = (
  page: number,
  searchQuery?: string,
  statusFilter?: string,
) =>
  queryOptions({
    queryKey: [adminAffiliatesKey, page, searchQuery, statusFilter],
    queryFn: () => getAffiliates(page, 15, searchQuery, statusFilter),
    placeholderData: keepPreviousData,
  });

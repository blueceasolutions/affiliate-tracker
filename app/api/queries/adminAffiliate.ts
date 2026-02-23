import { queryOptions } from "@tanstack/react-query";
import { getAdminAffiliate, getAdminAffiliateMetrics } from "../../lib/api";

export const adminAffiliateKey = "admin-affiliate";
export const adminAffiliateMetricsKey = "admin-affiliate-metrics";

export const adminAffiliateQuery = (id: string) =>
  queryOptions({
    queryKey: [adminAffiliateKey, id],
    queryFn: () => getAdminAffiliate(id),
    enabled: !!id,
  });

export const adminAffiliateMetricsQuery = (id: string) =>
  queryOptions({
    queryKey: [adminAffiliateMetricsKey, id],
    queryFn: () => getAdminAffiliateMetrics(id),
    enabled: !!id,
  });

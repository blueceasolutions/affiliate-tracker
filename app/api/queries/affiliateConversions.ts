import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getAffiliateConversions } from "../../lib/api";

export const affiliateConversionsKey = "affiliate-conversions";
export const affiliateConversionsQuery = (page: number) =>
  queryOptions({
    queryKey: [affiliateConversionsKey, page],
    queryFn: () => getAffiliateConversions(page, 20),
    placeholderData: keepPreviousData,
  });

import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getWithdrawalRequests } from "../../lib/api";

export const withdrawalsKey = "withdrawals";
export const withdrawalsQuery = (page: number, statusFilter?: string) =>
  queryOptions({
    queryKey: [withdrawalsKey, page, statusFilter],
    queryFn: () => getWithdrawalRequests(page, 20, statusFilter),
    placeholderData: keepPreviousData,
  });

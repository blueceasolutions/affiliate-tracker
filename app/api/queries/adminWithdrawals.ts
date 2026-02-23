import { queryOptions } from "@tanstack/react-query";
import { getAllWithdrawalRequests } from "../../lib/api";

export const adminWithdrawalsKey = "adminWithdrawals";

export const adminWithdrawalsQuery = (
  page: number = 1,
  limit: number = 20,
  emailFilter?: string,
  statusFilter?: string,
) =>
  queryOptions({
    queryKey: [adminWithdrawalsKey, page, limit, emailFilter, statusFilter],
    queryFn: () =>
      getAllWithdrawalRequests(page, limit, emailFilter, statusFilter),
  });

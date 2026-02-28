import { mutationOptions } from "@tanstack/react-query";
import { requestWithdrawal } from "../../lib/api";

export const requestWithdrawalKey = "request-withdrawal";
export const requestWithdrawalMutation = mutationOptions({
  mutationKey: [requestWithdrawalKey],
  mutationFn: (
    { amount, method, details, exchangeRate, convertedAmountNgn }: {
      amount: number;
      method: string;
      details: any;
      exchangeRate?: number;
      convertedAmountNgn?: number;
    },
  ) =>
    requestWithdrawal(
      amount,
      method,
      details,
      exchangeRate,
      convertedAmountNgn,
    ),
});

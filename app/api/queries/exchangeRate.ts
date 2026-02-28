import { queryOptions } from "@tanstack/react-query";
import { getExchangeRate } from "../../lib/api";

export const exchangeRateKey = "exchange-rate";

export const exchangeRateQuery = queryOptions({
  queryKey: [exchangeRateKey],
  queryFn: () => getExchangeRate(),
});

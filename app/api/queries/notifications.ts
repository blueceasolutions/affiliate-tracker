import { queryOptions } from "@tanstack/react-query";
import { getUnreadNotifications } from "../../lib/api";

export const unreadNotificationsKey = "unread-notifications";
export const unreadNotificationsQuery = queryOptions({
  queryKey: [unreadNotificationsKey],
  queryFn: getUnreadNotifications,
});

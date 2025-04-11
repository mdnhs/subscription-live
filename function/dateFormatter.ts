import { format } from "date-fns";

/**
 * Returns expiration date as a formatted string (e.g., "May 10, 2025")
 * by adding (months * 30 days) to the given order date.
 */
export function getFormattedExpireDate(orderDate: string | Date, months: number): string {
  const date = new Date(orderDate);
  const daysToAdd = months * 30;
  date.setDate(date.getDate() + daysToAdd);
  return format(date, "MMM dd, yyyy");
}

/**
 * Returns expiration duration as a string (e.g., "30 days", "60 days")
 */
export function getExpireDays(months: number): string {
  return `${months * 30} days`;
}

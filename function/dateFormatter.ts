import { format } from "date-fns";

/**
 * Returns expiration date as a formatted string (e.g., "May 10, 2025")
 * by adding (months * 30 days) to the given order date.
 */
export function getFormattedExpireDate(expireDate: string | Date): string {
  const date = new Date(expireDate);
  return format(date, "MMM dd, yyyy");
}

export function setFormattedExpireDate(
  orderDate: string | Date,
  months: number
): string | Date {
  const date = new Date(orderDate);
  const daysToAdd = months * 30;
  date.setDate(date.getDate() + daysToAdd);

  return typeof orderDate === "string" ? date.toISOString() : date;
}

/**
 * Returns expiration duration as a string (e.g., "30 days", "60 days")
 */
export function getExpireDays(months: number): string {
  return `${months * 30} days`;
}

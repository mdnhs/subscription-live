import { cookies } from "next/headers";

interface FetchOptions {
  page?: number;
  limit?: number;
}

interface SubscriptionResponse {
  data: CookieItem[]; // Adjust this type based on your actual data structure
  pagination?: Pagination; // Adjust this type as needed
  error?: string;
}

// Define CookieItem and Pagination interfaces (assumed from previous context)
interface CookieItem {
  _id: string;
  title: string;
  targetUrl: string;
  json: { name: string; value: string }[] | string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export async function fetchSubscriptions(
  options: FetchOptions = {}
): Promise<SubscriptionResponse> {
  try {
    // Dynamically determine the base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"; // Fallback to localhost in dev
    const url = new URL(`${baseUrl}/api/subscriptions`);

    // Set query parameters if provided
    if (options.page !== undefined)
      url.searchParams.set("page", options.page.toString());
    if (options.limit !== undefined)
      url.searchParams.set("limit", options.limit.toString());

    // Get cookies for the request
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await fetch(url.toString(), {
      headers: {
        Cookie: cookieHeader,
      },
      next: { revalidate: 60 }, // Optional: cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("fetchSubscriptions error:", error);
    return { data: [], error: "Failed to fetch subscriptions" };
  }
}
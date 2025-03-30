import { cookies } from "next/headers";
import NodeCache from "node-cache";

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

const cache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

export async function fetchSubscriptions(
  options: FetchOptions = {}
): Promise<SubscriptionResponse> {
  const cacheKey = `subscriptions_${options.page ?? 1}_${options.limit ?? 10}`;
  const cachedData = cache.get<SubscriptionResponse>(cacheKey);

  if (cachedData) return cachedData; // Return cached data instantly

  try {
    const baseUrl = process.env.PUBLIC_BASE_URL;
    const url = new URL(`${baseUrl}/api/subscriptions`);
    if (options.page) url.searchParams.set("page", options.page.toString());
    if (options.limit) url.searchParams.set("limit", options.limit.toString());

    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await fetch(url.toString(), {
      headers: { Cookie: cookieHeader },
    });

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    cache.set(cacheKey, data); // Cache the result
    return data;
  } catch (error) {
    console.error("fetchSubscriptions error:", error);
    return { data: [], error: "Failed to fetch subscriptions" };
  }
}

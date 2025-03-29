import { cookies } from "next/headers";

export async function fetchSubscriptions(options?: {
  page?: number;
  limit?: number;
}) {
  try {
    const url = new URL(`http://localhost:3000/api/subscriptions`);

    if (options?.page) url.searchParams.set("page", options.page.toString());
    if (options?.limit) url.searchParams.set("limit", options.limit.toString());

    const response = await fetch(url.toString(), {
      headers: {
        Cookie: (
          await cookies()
        )
          .getAll()
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join("; "),
      },
      next: { revalidate: 60 }, // Optional: cache for 60 seconds
    });

    if (!response.ok) throw new Error("Failed to fetch subscriptions");

    return await response.json();
  } catch (error) {
    console.error("fetchSubscriptions error:", error);
    return { data: [], error: "Failed to fetch subscriptions" };
  }
}

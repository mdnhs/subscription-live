import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchSubscriptions } from "./lib/api";
import HomeClient from "@/components/Home/HomeClient";

// Type for the expected return value of fetchSubscriptions
interface FetchSubscriptionsResponse {
  data: CookieItem[];
  pagination?: Pagination;
}

// Define CookieItem and Pagination interfaces
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

export default async function Home({
  searchParams: searchParamsPromise,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  const searchParams = await searchParamsPromise; // Await the Promise

  // Get pagination params from URL
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const limit = searchParams?.limit ? Number(searchParams.limit) : 10;

  // Fetch subscriptions with pagination
  const { data: subscriptions, pagination }: FetchSubscriptionsResponse =
    await fetchSubscriptions({
      page,
      limit,
    });

  return (
    <HomeClient
      session={session}
      initialSubscriptions={subscriptions || []}
      initialPagination={pagination}
    />
  );
}
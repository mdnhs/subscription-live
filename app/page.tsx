import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchSubscriptions } from "./lib/api";
import HomeClient from "@/components/Home/HomeClient";

export default async function Home({
  searchParams: searchParamsPromise,
}: {
  readonly searchParams?: {
    readonly [key: string]: string | string[] | undefined;
  };
}) {
  const session = await getServerSession(authOptions);
  const searchParams = await searchParamsPromise; // Await the searchParams

  // Get pagination params from URL
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const limit = searchParams?.limit ? Number(searchParams.limit) : 10;

  // Fetch subscriptions with pagination
  const { data: subscriptions, pagination } = await fetchSubscriptions({
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
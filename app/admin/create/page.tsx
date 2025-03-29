import { SubscriptionList } from "@/components/Subscription/SubscriptionList";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";

export default function page() {
  return (
    <main className="container mx-auto py-8">
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <SubscriptionList />
      </Suspense>
    </main>
  );
}

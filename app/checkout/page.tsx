import CheckoutSection from "@/_components/checkout/CheckoutSection";
import { getTool } from "@/services/api/toolRequest";
import { fetchPublic } from "@/services/fetch/ssrFetch";
import React, { Suspense } from "react";

export default async function page() {
  let tools;
  try {
    const req = getTool();
    const res = await fetchPublic(req);

    // Extract and filter the data
    tools = res?.data ?? [];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return (
    <div className="container py-5">
      <Suspense fallback={<>Loading...</>}>
        <CheckoutSection tools={tools} />
      </Suspense>
    </div>
  );
}

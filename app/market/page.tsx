import ExploreSection from "@/_components/explore/ExploreSection";
import { getProducts } from "@/services/api/productRequest";
import { fetchPublic } from "@/services/fetch/ssrFetch";
import React from "react";

export default async function page() {
  let products;
  try {
    const req = getProducts();
    const res = await fetchPublic(req);

    // Extract and filter the data
    products = res?.data ?? [];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return (
    <div className=" container py-5">
      <ExploreSection products={products} />
    </div>
  );
}

import { FallbackImage } from "@/_components/container/FallbackImage";
import MarketSection from "@/_components/market/MarketSection";
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
    <div className="relative pt-28 pb-8">
      <FallbackImage
        src={"/images/hero-left-bg.svg"}
        className=" h-[1500px] w-[1500px] absolute -top-80 left-0 pointer-events-none opacity-90 -z-10"
      />
      <div className=" container  ">
        <MarketSection products={products} />
      </div>
    </div>
  );
}

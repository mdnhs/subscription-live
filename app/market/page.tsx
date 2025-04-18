import MarketSection from "@/_components/market/MarketSection";
import { getProducts } from "@/services/api/productRequest";
import { fetchPublic } from "@/services/fetch/ssrFetch";

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
    <div className=" pt-28 pb-8">
      <div className=" container  ">
        <MarketSection products={products} />
      </div>
    </div>
  );
}

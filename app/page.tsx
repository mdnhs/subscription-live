import ProductSection from "@/_components/products/ProductSection";
import { getProducts } from "@/services/api/productRequest";
import { fetchPublic } from "@/services/fetch/ssrfetchPublic";
import Image from "next/image";

export default async function Home() {
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
    <div className="container py-5 space-y-5">
      <div className=" bg-background/95 dark:bg-black h-96 w-full rounded-2xl flex justify-center items-center relative">
        {" "}
        <Image
          src={"/placeholder.svg"}
          fill
          alt=""
          className="object-cover rounded-2xl"
        />
      </div>
      <div>
        <ProductSection products={products} />
      </div>
    </div>
  );
}

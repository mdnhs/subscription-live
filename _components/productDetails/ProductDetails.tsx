"use client";
import { useProductStore } from "@/_store/ProductStore";
import { usePathname } from "next/navigation";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import Banner from "./Banner";
import Details from "./Details";

interface ProductDetailsParams {
  productId: string;
}

const ProductDetails = (params: ProductDetailsParams) => {
  const path: string = usePathname();
  const { cachedProductById } = useProductStore();
  
  // Get product from cache
  const product = cachedProductById[params?.productId];

  return (
    <div className="bg-background/95 text-white min-h-screen p-5 rounded-2xl space-y-5">
      <BreadCrumb PathName="Product" Path={path} />
      <div className="grid justify-around grid-cols-1 gap-5 md:gap-0 md:grid-cols-2">
        {product && <Banner product={product} />}
        {product && <Details product={product} />}
      </div>
    </div>
  );
};

export default ProductDetails;
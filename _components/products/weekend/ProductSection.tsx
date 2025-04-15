"use client";
import { Product } from "@/_types/product";
import { LinkButton } from "../../container/UpEasyButtons";
import ProductsList from "./ProductsList";

const ProductSection = ({ products }: { products: Product[] }) => {
  return (
    <div className=" h-[calc(100vh-60vh)]">
      <div className="bg-transparent backdrop-blur-3xl rounded-2xl h-fit px-5 overflow-hidden md:overflow-visible pt-5 pb-10">
        <div className="pb-5 flex flex-wrap justify-between items-center">
          <h2 className="font-bold text-2xl font-bruno italic lowercase bg-gradient-to-t from-brand-1  to-white bg-clip-text text-transparent">
            Trending on this week
          </h2>
          <LinkButton btnText="View All" target="/market" />
        </div>
        <ProductsList products={products} />
      </div>
    </div>
  );
};

export default ProductSection;

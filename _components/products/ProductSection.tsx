"use client";
import { Product } from "@/_types/product";
import { LinkButton } from "../container/UpEasyButtons";
import ProductsList from "./ProductsList";

const ProductSection = ({
  products,
  headline,
  url,
  type,
}: {
  products: Product[];
  headline: string;
  url: string;
  type: string;
}) => {
  return (
    <div className={`${type === "week" ? "h-[calc(100vh-60vh)]" : "h-fit"}`}>
      <div className="bg-transparent backdrop-blur-3xl rounded-2xl h-fit px-5 overflow-hidden md:overflow-visible py-10">
        <div className="pb-5 flex flex-wrap justify-between items-center">
          <h2 className="font-bold text-2xl font-bruno italic lowercase bg-gradient-to-t from-brand-1  to-white bg-clip-text text-transparent">
            {headline}
          </h2>
          <LinkButton btnText="View All" target={url ?? "#"} />
        </div>
        <ProductsList products={products} type={type} />
      </div>
    </div>
  );
};

export default ProductSection;

"use client";
import { Product } from "@/_types/product";
import { LinkButton } from "../container/UpEasyButtons";
import SectionHeader from "../ui/SectionHeader";
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
      <div className="bg-transparent rounded-2xl h-fit overflow-hidden md:overflow-visible py-5">
        <div className="pb-5 flex flex-wrap justify-between items-center">
          <SectionHeader text={headline} />
          <LinkButton btnText="View All" target={url ?? "#"} />
        </div>
        <ProductsList products={products} type={type} />
      </div>
    </div>
  );
};

export default ProductSection;

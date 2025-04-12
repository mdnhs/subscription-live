"use client";
import { Product } from "@/_types/product";
import { ArrowRight } from "lucide-react";
import ProductsList from "./ProductsList";
import Link from "next/link";

const ProductSection = ({ products }: { products: Product[] }) => {
  return (
    <div className="p-10 bg-background/95 rounded-2xl">
      <div className="pb-10 flex flex-wrap justify-between items-center">
        <h2 className="font-bold text-2xl">Brand New</h2>
        <Link href={"/explore"}>
        <span
          className="font-normal text-[14px]
          float-right text-primary flex 
          items-center cursor-pointer hover:text-teal-600"
        >
          View All Collection <ArrowRight className="h-4" />
        </span>
        </Link>
      </div>
      <ProductsList products={products} />
    </div>
  );
};

export default ProductSection;

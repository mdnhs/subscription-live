"use client";
import { ArrowRight } from "lucide-react";
import React, { useEffect } from "react";
import Loader from "../loader/Loader";
import ProductsList from "./ProductsList";
import { useProductStore } from "@/_store/ProductStore";

const ProductSection = () => {
  const { products, loading, getLatestProducts } = useProductStore();

  useEffect(() => {
    getLatestProducts();
  }, [getLatestProducts]);

  return (
    <div className="p-10 bg-background/95 rounded-2xl">
      <div className="pb-10 flex flex-wrap justify-between items-center">
        <h2 className="font-bold text-2xl">Brand New</h2>
        <span
          className="font-normal text-[14px]
          float-right text-primary flex 
          items-center cursor-pointer hover:text-teal-600"
        >
          View All Collection <ArrowRight className="h-4" />
        </span>
      </div>
      {loading ? <Loader /> : <ProductsList products={products} />}
    </div>
  );
};

export default ProductSection;

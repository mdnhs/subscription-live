// components/ProductsList.tsx
import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/_types/product";

type Props = { products: Product[] };

const ProductsList = ({ products }: Props) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;
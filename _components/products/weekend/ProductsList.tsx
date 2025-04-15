// components/ProductsList.tsx
import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/_types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props = { products: Product[] };

const ProductsList = ({ products }: Props) => {
  return (
    <div className="w-full container">
      <Carousel className="w-full">
        <CarouselContent className=" gap-3">
          {products?.map((product, idx) => (
            <CarouselItem
              key={product.id}
              className={`basis-full pl-0 sm:basis-1/2 lg:basis-1/3`}
              style={{ zIndex: products.length - idx }}
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-8" />
        <CarouselNext className="-right-10" />
      </Carousel>
    </div>
  );
};

export default ProductsList;

// components/ProductsList.tsx
import React from "react";
import { Product } from "@/_types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import WeekProductCard from "./WeekProductCard";
import CommonProductCard from "./CommonProductCard";

type Props = { products: Product[]; type: string };

const ProductsList = ({ products, type }: Props) => {
  const classItem = `basis-full pl-0 sm:basis-1/2 ${
    type === "week" ? "lg:basis-1/3" : "lg:basis-1/4"
  } `;
  return (
    <div className="w-full container">
      <Carousel className="w-full">
        <CarouselContent className=" gap-3">
          {products?.map((product, idx) => (
            <CarouselItem
              key={product.id}
              className={classItem}
              style={{ zIndex: products.length - idx }}
            >
              {type === "week" ? (
                <WeekProductCard product={product} />
              ) : (
                <CommonProductCard product={product} />
              )}
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

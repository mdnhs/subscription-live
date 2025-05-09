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
import Autoplay from "embla-carousel-autoplay";
import ProductMobile from "./productMobile/ProductMobile";
import ProductWeb from "./productWeb/ProductWeb";

type Props = { products: Product[]; type: string };

const ProductsList = ({ products, type }: Props) => {
  const classItem = `basis-full pl-0 sm:basis-1/2 last:mr-3 ${
    type === "week" ? "lg:basis-1/3" : "lg:basis-1/4"
  } `;
  return (
    <div className="w-full ">
      {(type === "week" || type === "common") && (
        <div className="container overflow-x-clip pr-6">
          <Carousel
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
              dragFree: false,
            }}
            className="w-full select-none"
          >
            <CarouselContent className=" gap-3">
              {products
                ?.sort((a, b) => (b.isOffer ? 1 : 0) - (a.isOffer ? 1 : 0))
                .map((product, idx) => (
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
            <CarouselPrevious className="-left-2" />
            <CarouselNext className="-right-2" />
          </Carousel>
        </div>
      )}
      {/* Mobile Product */}
      {type === "mobile" && <ProductMobile products={products} />}
      {type === "web" && <ProductWeb products={products} />}
    </div>
  );
};

export default ProductsList;

import { Product } from "@/_types/product";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getExpireDays } from "@/function/dateFormatter";
import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { FallbackImage } from "../container/FallbackImage";
import BuyButtonContainer from "../productDetails/BuyButtonContainer";
import { getProductPrice } from "@/function/priceFormatter";

const WeekProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="group border rounded-2xl border-gray-50/20 bg-brand-3/50 backdrop-blur-xs text-white shadow-md hover:shadow-lg py-0 gap-0  w-full relative">
      <div className="absolute w-full h-full rounded-2xl overflow-hidden">
        <FallbackImage
          src={product?.banner?.url}
          alt={`${product?.title} banner`}
          imgClassName="object-cover transition-transform duration-300 group-hover:scale-110 blur-xl"
          className=" w-20 h-full top-0 rounded-2xl overflow-hidden blur-2xl"
        />
      </div>
      {/* Content Section */}
      <CardContent className=" flex items-start gap-3 p-3 relative">
        {/* Image Section */}
        <Link
          href={`/market/${product?.documentId}`}
          className="aspect-square basis-1/3 h-full border rounded-2xl border-gray-50/20"
        >
          <FallbackImage
            src={product?.banner?.url}
            alt={`${product?.title} banner`}
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-110"
            className=" aspect-square rounded-2xl overflow-hidden"
          />
        </Link>
        <div className="basis-2/3 space-y-2 h-full flex flex-col justify-center">
          <div className=" flex justify-between items-center w-full">
            <h2 className="truncate font-semibold tracking-tight text-start">
              {product?.title}
            </h2>
            <p className=" font-semibold bg-gradient-to-t from-brand-1 via-brand-1 to-white bg-clip-text text-transparent text-start text-2xl">
              {product?.isFree ? "FREE" : `${getProductPrice(product)}৳`}{" "}
              {(product?.isOffer || product?.isFree) && (
                <span className="text-white font-normal text-base line-through">
                  {product?.price?.toLocaleString()}৳
                </span>
              )}
            </p>
          </div>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-gray-700 text-gray-200 dark:bg-gray-800 dark:text-gray-300"
          >
            <CalendarClock />
            <span className="">
              {product?.month} Month ({getExpireDays(product?.month)})
            </span>
          </Badge>
        </div>
        <div className=" absolute -bottom-6 right-5 flex justify-end w-full">
          <BuyButtonContainer product={product} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekProductCard;

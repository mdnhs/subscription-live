import { Product } from "@/_types/product";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getExpireDays } from "@/function/dateFormatter";
import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { FallbackImage } from "../container/FallbackImage";
import BuyButtonContainer from "../productDetails/BuyButtonContainer";
import { getProductPrice } from "@/function/priceFormatter";

const CommonProductCard = ({
  product,
  isCredit,
}: {
  product: Product;
  isCredit?: boolean;
}) => {
  return (
    <Card className="group border rounded-2xl border-gray-50/20 bg-brand-3 backdrop-blur-2xl text-white overflow-hidden shadow-md hover:shadow-lg py-0 gap-0 p-3 w-full  h-fit relative">
      <FallbackImage
        src={product?.banner?.url}
        alt={`${product?.title} banner`}
        imgClassName="object-cover transition-transform duration-300 group-hover:scale-110 blur-xl"
        className=" w-1/2 h-full top-0 rounded-2xl overflow-hidden absolute right-0 blur-[120px]"
      />
      {/* Content Section */}
      <CardContent className=" px-0 relative flex flex-col">
        {/* Image Section */}
        <Link
          href={`/market/${product?.documentId}`}
          className=" h-fit border rounded-2xl border-gray-50/20"
        >
          <FallbackImage
            src={product?.banner?.url}
            alt={`${product?.title} banner`}
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-110"
            className="aspect-square rounded-2xl overflow-hidden"
          />
        </Link>
        <div className="pt-4 space-y-2 h-fit flex flex-col justify-center">
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
        <div className="flex justify-between items-center w-full pt-5">
          <div className="">
            <h2 className="truncate font-semibold tracking-tight text-start">
              {product?.title}
            </h2>
            <p className=" font-medium bg-gradient-to-t from-brand-1 via-brand-1 to-white bg-clip-text text-transparent text-start text-2xl">
              {product?.isFree ? "FREE" : `${getProductPrice(product)}৳`}{" "}
              {(product?.isOffer || product?.isFree) && (
                <span className="text-white font-normal text-base line-through">
                  {product?.price?.toLocaleString()}৳
                </span>
              )}
            </p>
          </div>
          <BuyButtonContainer isCredit={isCredit} product={product} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CommonProductCard;

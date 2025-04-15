import { Product } from "@/_types/product";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getExpireDays } from "@/function/dateFormatter";
import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { FallbackImage } from "../container/FallbackImage";
import BuyButtonContainer from "../productDetails/BuyButtonContainer";

const WeekProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="group border rounded-2xl border-gray-50/20 bg-transparent backdrop-blur-xs text-white shadow-md hover:shadow-lg py-0 gap-0 p-3 w-full relative">
      <FallbackImage
        src={product?.banner?.url}
        alt={`${product?.title} banner`}
        imgClassName="object-cover transition-transform duration-300 group-hover:scale-110 blur-xl"
        className=" w-20 h-full top-0 rounded-2xl overflow-hidden absolute left-0 blur-2xl"
      />
      {/* Content Section */}
      <CardContent className=" flex items-start gap-3 px-0 relative">
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
              {product?.price?.toLocaleString()}৳
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
        <div className=" absolute -bottom-10 flex justify-end w-full">
          <BuyButtonContainer product={product} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekProductCard;

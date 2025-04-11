import { Product } from "@/_types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { AlarmClock, BadgeCheck } from "lucide-react";
import BuyButton from "./BuyButton";

const Details = ({ product }: { product: Product }) => {
  return (
    <div className="space-y-6">
      {product?.documentId ? (
        <div className="space-y-4">
          {/* Title */}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {product?.title}
          </h2>

          {/* Category */}
          <p className="text-sm text-muted-foreground">{product?.category}</p>

          {/* Description */}
          <p className="text-sm text-foreground leading-relaxed">
            {product?.description?.[0]?.children?.[0]?.text ??
              "No description available"}
          </p>

          {/* Instant Delivery */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {product?.instantDelivery ? (
              <>
                <BadgeCheck className="h-5 w-5 text-green-500" />
                <span>Eligible for Instant Delivery</span>
              </>
            ) : (
              <>
                <AlarmClock className="h-5 w-5 text-brand-1" />
                <span>Delivery can take up to 2 or 3 hours</span>
              </>
            )}
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-primary">
            ৳{product?.price.toLocaleString()}
          </p>

          {/* Add to Cart Button */}
          <BuyButton product={product} />
        </div>
      ) : (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" /> {/* Title */}
          <Skeleton className="h-4 w-1/4" /> {/* Category */}
          <Skeleton className="h-16 w-full" /> {/* Description */}
          <Skeleton className="h-4 w-1/3" /> {/* Instant Delivery */}
          <Skeleton className="h-8 w-1/4" /> {/* Price */}
          <Skeleton className="h-10 w-full sm:w-32" /> {/* Button */}
        </div>
      )}
    </div>
  );
};

export default Details;

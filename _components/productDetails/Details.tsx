"use client";

import { useCartStore } from "@/_store/CartStore";
import { Product } from "@/_types/product";
import { AlertOctagon, BadgeCheck, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
const Details = ({ product }: { product: Product }) => {
  const { data: clientSession, status } = useSession();
  const router = useRouter();
  const { loading, addToCart, getCartItems } = useCartStore();

  const handleAddToCart = async () => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else {
      await addToCart({
        data: {
          username: clientSession?.user?.name,
          email: clientSession?.user?.email,
          products: [product?.documentId],
        },
      });
      router.push(`/checkout`);
      if (clientSession?.user?.email) {
        getCartItems(clientSession.user.email);
        toast.success("Added to Cart", {
          description: `${product.title} has been added to your cart.`,
          duration: 3000,
        });
      } else {
        console.error("User email is not available");
      }
    }
  };

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
              <BadgeCheck className="h-5 w-5 text-green-500" />
            ) : (
              <AlertOctagon className="h-5 w-5 text-red-500" />
            )}
            <span>Eligible for Instant Delivery</span>
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-primary">
            ৳{product?.price.toLocaleString()}
          </p>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={loading}
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white transition-colors"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>{loading ? "Buying..." : "Buy"}</span>
          </Button>
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

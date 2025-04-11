"use client";

import { Product } from "@/_types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarClock, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FallbackImage } from "../container/FallbackImage";
import useCartStore from "@/_store/CartStore";
import { getExpireDays } from "@/function/dateFormatter";

const ProductCard = ({ product }: { product: Product }) => {
  const { cartItems, addToCart, clearCart } = useCartStore();
  const { status } = useSession();
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      if (status === "unauthenticated") {
        router.push("/login");
        return;
      }

      // Clear existing cart items if any
      if (cartItems.length > 0) {
        clearCart();
      }

      // Add the new product to cart
      addToCart({
        documentId: product.documentId,
        title: product.title,
        price: product.price,
        category: product.category,
        month: product.month,
        banner: product.banner,
      });

      // Redirect to checkout
      router.push(`/checkout`);
    } catch (error) {
      console.error("Error in handleAddToCart:", error);
      // Optionally show error to user
    }
  };

  return (
    <Card className="group overflow-hidden border border-gray-50/20 bg-gray-800 text-white shadow-md hover:shadow-lg dark:bg-background/95 py-0 gap-0">
      {/* Image Section */}
      <Link href={`/product-details/${product?.documentId}`} className="block">
        <FallbackImage
          src={product?.banner?.url}
          alt={`${product?.title} banner`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          imgClassName="object-cover transition-transform duration-300 group-hover:scale-110"
          className="h-[170px] w-full"
        />
      </Link>

      {/* Content Section */}
      <CardContent className="p-4">
        <h2 className="truncate text-sm font-semibold tracking-tight">
          {product?.title}
        </h2>
        <div className="mt-2 flex items-center justify-between">
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-gray-700 text-gray-200 dark:bg-gray-800 dark:text-gray-300"
          >
            <CalendarClock />
            <span className="text-xs">{product?.month} Month ({getExpireDays(product?.month)})</span>
          </Badge>
          <span className="text-sm font-medium text-teal-400">
            ৳{product?.price?.toLocaleString()}
          </span>
        </div>
      </CardContent>

      {/* Footer with Buttons */}
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-4 md:gap-0 justify-between items-center ">
        <Link
          href={`/product-details/${product?.documentId}`}
          className="block"
        >
          <Button variant="destructive" className="!bg-brand-1">
            View Details
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={handleAddToCart}
          className="text-black dark:text-white"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Buy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

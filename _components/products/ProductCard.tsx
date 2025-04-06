"use client";

import { CalendarClock, List, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/_store/CartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Product } from "@/_types/product";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart, getCartItems } = useCartStore();
  const { data: clientSession, status } = useSession();
  const router = useRouter();

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
      if (clientSession?.user?.email) {
        getCartItems(clientSession.user.email);
      } else {
        console.error("User email is not available");
      }
    }
  };

  return (
    <Card className="group overflow-hidden border border-gray-50/20 bg-gray-800 text-white shadow-md hover:shadow-lg dark:bg-background/95 py-0 gap-0">
      {/* Image Section */}
      <div className="relative h-[170px] w-full">
        <Link
          href={`/product-details/${product?.documentId}`}
          className="block"
        >
          <Image
            src={product?.banner?.url}
            alt={`${product?.title} banner`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
      </div>

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
            <span className="text-xs">{product?.month} Month</span>
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
          <Button variant="destructive">View Details</Button>
        </Link>
        <Button
          variant="outline"
          onClick={handleAddToCart}
          className="text-black dark:text-white"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

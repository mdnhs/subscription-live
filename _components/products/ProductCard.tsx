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

// Define the cart item type (consistent with CheckoutSection)
type LocalCartItem = {
  documentId: string;
  products: {
    documentId: string;
    title: string;
    price: number;
    category: string;
    month: number;
    banner?: { url: string };
  }[];
};

const ProductCard = ({ product }: { product: Product }) => {
  const { data: clientSession, status } = useSession();
  const router = useRouter();

  const handleAddToCart = () => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (!clientSession?.user?.email) {
      console.error("User email is not available");
      return;
    }

    // Prepare the cart item
    const newCartItem: LocalCartItem = {
      documentId: `local-${Date.now()}`, // Unique ID for local storage
      products: [
        {
          documentId: product.documentId,
          title: product.title,
          price: product.price,
          category: product.category,
          month: product.month,
          banner: product.banner ? { url: product.banner.url } : undefined,
        },
      ],
    };

    // Load existing cart from local storage
    const storedCart = localStorage.getItem("localCart");
    const currentCart: LocalCartItem[] = storedCart ? JSON.parse(storedCart) : [];

    // Clear existing cart and add new item (mimicking previous behavior)
    const updatedCart = [newCartItem]; // Replace cart with new item
    localStorage.setItem("localCart", JSON.stringify(updatedCart));

    // Redirect to checkout
    router.push("/checkout");
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
            <span className="text-xs">{product?.month} Month</span>
          </Badge>
          <span className="text-sm font-medium text-teal-400">
            ৳{product?.price?.toLocaleString()}
          </span>
        </div>
      </CardContent>

      {/* Footer with Buttons */}
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-4 md:gap-0 justify-between items-center">
        <Link href={`/product-details/${product?.documentId}`} className="block">
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
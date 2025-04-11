"use client";
import React from "react";
import { toast } from "sonner";
import useCartStore from "@/_store/CartStore";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/_types/product";

type Props = { product: Product };

const BuyButton = ({ product }: Props) => {
  const { status } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const callbackUrl = encodeURIComponent(pathName);
  const { loading, addToCart, clearCart } = useCartStore();
  const handleAddToCart = async () => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }

    try {
      // Clear existing cart items if any
      clearCart();

      // Add the new product to cart
      addToCart({
        documentId: product.documentId,
        title: product.title,
        price: product.price,
        category: product.category,
        month: product.month,
        banner: product.banner,
      });

      // Show success notification
      toast.success("Added to Cart", {
        description: `${product.title} has been added to your cart.`,
        duration: 3000,
      });

      // Redirect to checkout
      router.push(`/checkout`);
    } catch (error) {
      toast.error("Failed to add to cart", {
        description: "Please try again later.",
        duration: 3000,
      });
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white transition-colors"
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      <span>{loading ? "Processing..." : "Buy"}</span>
    </Button>
  );
};

export default BuyButton;

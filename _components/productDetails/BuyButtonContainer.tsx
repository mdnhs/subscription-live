"use client";
import useCartStore from "@/_store/CartStore";
import { Product } from "@/_types/product";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = { product: Product };

const BuyButtonContainer = ({ product }: Props) => {
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
      className="[background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF] rounded-full text-lg font-semibold text-white h-12 px-6"
    >
      <span>{loading ? "Processing..." : "Buy Now"}</span>
    </Button>
  );
};

export default BuyButtonContainer;

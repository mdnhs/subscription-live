"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import useCartStore from "@/_store/CartStore";
import { useDistributionStore } from "@/_store/DistributionStore";
import { useToolStore } from "@/_store/ToolStore";
import useOrderStore from "@/services/store/useOrderStore";
import { createOrder } from "@/services/api/orderRequest";
import { ToolsResponse } from "@/_types/product";

// Dynamic import for Loader to reduce initial bundle
const Loader = dynamic(() => import("../loader/Loader"), { ssr: false });

// Constants
const PAYMENT_METHODS = [
  { id: "bkash", name: "bKash", icon: "📱" },
  { id: "nagad", name: "Nagad", icon: "💰" },
] as const;

const SUPPORT_CONTACT = {
  phone: "+01776569369",
  email: "mdnhs.cse@gmail.com",
};

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["id"];
interface CheckoutSectionProps {
  tools: ToolsResponse[];
}

interface GrantedToolDetails {
  documentId?: string;
  totalOrder?: number;
}

interface CartItem {
  documentId: string;
  title: string;
  price: number;
  category: string;
  month: number;
  banner?: { url: string };
}

// Reusable Components
const PaymentMethodButton = ({
  id,
  name,
  icon,
  isSelected,
  onSelect,
}: {
  id: PaymentMethod;
  name: string;
  icon: string;
  isSelected: boolean;
  onSelect: (id: PaymentMethod) => void;
}) => (
  <button
    onClick={() => onSelect(id)}
    className={`flex items-center justify-center gap-2 p-4 border rounded-lg transition-colors ${
      isSelected ? "border-teal-600 bg-teal-600/10" : "border-gray-200 hover:border-teal-600"
    }`}
    aria-pressed={isSelected}
    aria-label={`Select ${name} payment method`}
  >
    <span className="text-2xl">{icon}</span>
    <span>{name}</span>
  </button>
);

const OrderItem = ({ item }: { item: CartItem }) => (
  <li className="flex justify-between">
    <div className="inline-flex">
      {item?.banner?.url && (
        <Image
          src={item.banner.url}
          alt={item.title || "Product image"}
          height={100}
          width={100}
          sizes="100px"
          className="h-16 w-[6rem] rounded object-cover"
        />
      )}
      <div className="ml-3 flex flex-col items-start">
        <h3 className="text-sm font-medium text-white line-clamp-1">{item.title}</h3>
        <dl className="mt-0.5 space-y-px text-[12px] text-gray-100">
          <dd className="capitalize">{item.category}</dd>
          <dd>${item.price}</dd>
        </dl>
      </div>
    </div>
    <p className="text-sm font-semibold text-white">${item.price}</p>
  </li>
);

const CheckoutSection = ({ tools }: CheckoutSectionProps) => {
  const { data: session } = useSession();
  const { cartItems, loading, clearCart } = useCartStore();
  const { setOrder } = useOrderStore();
  const { distributions, getDistributionItems } = useDistributionStore();
  const { updateTools } = useToolStore();
  const searchParams = useSearchParams();

  const [total, setTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("bkash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState<string[]>([]);
  const [grantedTool, setGrantedTool] = useState<string[]>([]);
  const [grantedToolDetails, setGrantedToolDetails] = useState<GrantedToolDetails>({});
  const [productCategory, setProductCategory] = useState("");
  const [productMonth, setProductMonth] = useState(0);
  const [showSupportMessage, setShowSupportMessage] = useState(false);

  // Memoized values
  const cartProduct = useMemo(() => cartItems[0], [cartItems]);
  const filteredTools = useMemo(
    () =>
      Array.isArray(tools)
        ? tools.filter(
            (tool) => tool?.category === cartProduct?.category && tool?.month === cartProduct?.month
          )
        : [],
    [tools, cartProduct]
  );
  const distributionTools = useMemo(
    () => distributions.filter((tool) => tool?.toolName === cartProduct?.category),
    [distributions, cartProduct]
  );

  // Handle payment cancellation or failure
  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "cancel" || message === "failure") {
      toast.error("Payment failed. Please try again.");
    }
  }, [searchParams]);

  // Fetch distributions
  useEffect(() => {
    if (session?.user?.email && !distributions.length) {
      getDistributionItems();
    }
  }, [session?.user?.email, distributions.length, getDistributionItems]);

  // Calculate total
  useEffect(() => {
    if (!loading && cartItems.length) {
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + (Number(item?.price) || 0),
        0
      );
      setTotal(totalAmount);
    }
  }, [cartItems, loading]);

  // Handle tool selection
  useEffect(() => {
    if (!cartItems.length) {
      setProducts([]);
      setProductMonth(0);
      setProductCategory("");
      setGrantedTool([]);
      setGrantedToolDetails({});
      setShowSupportMessage(false);
      return;
    }

    const category = cartProduct?.category || "";
    const month = cartProduct?.month || 0;

    setProducts(cartItems.map((item) => item.documentId));
    setProductCategory(category);
    setProductMonth(month);

    const MAX_TOOL_ORDERS = distributionTools[0]?.numberOfUser ?? 10;
    const availableTool = filteredTools.find(
      (tool) => (tool?.totalOrder || 0) < MAX_TOOL_ORDERS
    );

    if (availableTool?.documentId) {
      setGrantedTool([availableTool.documentId]);
      setGrantedToolDetails({
        documentId: availableTool.documentId,
        totalOrder: availableTool.totalOrder || 0,
      });
      setShowSupportMessage(false);
    } else {
      setGrantedTool([]);
      setGrantedToolDetails({});
      setShowSupportMessage(true);
    }
  }, [cartItems, filteredTools, distributionTools, cartProduct]);

  const createOrderAndUpdateCart = async () => {
    if (!session?.user?.email) {
      toast.error("Please sign in to create an order.");
      return null;
    }

    const payload = {
      data: {
        email: session.user.email,
        username: session.user.name || "",
        amount: total,
        products,
        category: productCategory,
        month: productMonth,
        tools: grantedTool,
      },
    };

    try {
      const response = await createOrder(payload);
      const { data } = response;

      if (data) {
        setOrder(data);
        return data.data;
      }
      throw new Error("No data returned from order creation.");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to create order.");
      return null;
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  const handleBkashPayment = async () => {
    if (!cartItems.length || !session?.user || showSupportMessage) {
      toast.error("Cannot proceed with payment.");
      return;
    }

    if (!grantedToolDetails.documentId) {
      toast.error("No available tool selected.");
      return;
    }

    setIsProcessing(true);

    try {
      await createOrderAndUpdateCart();

      const response = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total.toString(),
          name: session.user.name,
          email: session.user.email,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        toast.error(
          response.status === 409
            ? "Please refresh the page and try again."
            : errorMessage.statusMessage || "Payment failed."
        );
        return;
      }

      const sessionData = await response.json();
      if (sessionData.bkashURL) {
        await updateTools(grantedToolDetails.documentId, {
          totalOrder: (grantedToolDetails.totalOrder || 0) + 1,
        });
        clearCart();
        window.location.href = sessionData.bkashURL;
      } else {
        toast.error("Failed to initiate bKash payment.");
      }
    } catch (error) {
      console.error("bKash payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto w-full max-w-7xl bg-background/95 rounded-2xl">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-10 gap-6 p-4 sm:p-6">
        {/* Payment Section */}
        <section className="col-span-1 lg:col-span-6 py-6 sm:py-12">
          <div className="mx-auto w-full max-w-lg">
            <h1 className="text-2xl font-medium sm:text-3xl">
              Secure Checkout
              <span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20 rounded-r-2xl" />
            </h1>

            <div className="mt-6">
              <h2 className="text-lg font-medium mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-4">
                {PAYMENT_METHODS.map(({ id, name, icon }) => (
                  <PaymentMethodButton
                    key={id}
                    id={id}
                    name={name}
                    icon={icon}
                    isSelected={selectedPayment === id}
                    onSelect={handlePaymentMethodChange}
                  />
                ))}
              </div>
            </div>

            {total > 0 && (
              <div className="mt-6">
                {selectedPayment === "bkash" && (
                  <Button
                    onClick={handleBkashPayment}
                    disabled={isProcessing}
                    className="w-full py-2 mt-4 bg-teal-600 text-white rounded-md hover:bg-teal-800"
                    aria-label="Pay with bKash"
                  >
                    {isProcessing ? "Processing..." : "Pay with bKash"}
                  </Button>
                )}
                {selectedPayment === "nagad" && (
                  <div className="p-4 bg-gray-100 rounded text-black">
                    <p>Nagad integration coming soon</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Order Summary Section */}
        <section className="relative col-span-1 lg:col-span-4 py-6 sm:py-12">
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900 to-teal-600 opacity-95 rounded-r-2xl" />
          <div className="relative px-4">
            <h2 className="sr-only">Order summary</h2>
            <ul className="space-y-5">
              {cartItems?.map((item: CartItem, idx: number) => (
                <OrderItem key={idx} item={item} />
              ))}
            </ul>

            <div className="my-5 h-0.5 w-full bg-background/95 bg-opacity-30" />
            <div className="space-y-2">
              <p className="flex justify-between text-lg font-bold text-white">
                <span>Total price:</span>
                <span>${total}</span>
              </p>
            </div>

            <div className="mt-10 text-white">
              <h3 className="mb-5 text-lg font-bold">Support</h3>
              <p className="text-sm font-semibold">
                {SUPPORT_CONTACT.phone} <span className="font-light">(Bangladesh)</span>
              </p>
              <p className="mt-1 text-sm font-semibold">
                {SUPPORT_CONTACT.email} <span className="font-light">(Email)</span>
              </p>
              <p className="mt-2 text-xs font-medium">
                Call us now for payment related issues
              </p>
            </div>

            <div className="mt-10">
              <p className="flex flex-col">
                <span className="text-sm font-bold text-white">Money Back Guarantee</span>
                <span className="text-xs font-medium text-white">
                  within 30 days of purchase
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CheckoutSection;
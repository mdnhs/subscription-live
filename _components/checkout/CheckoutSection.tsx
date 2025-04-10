"use client";
import { useDistributionStore } from "@/_store/DistributionStore";
import { useOrderStore } from "@/_store/OrderStore";
import { useToolStore } from "@/_store/ToolStore";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Loader from "../loader/Loader";
import useCartStore from "@/_store/CartStore";

const PAYMENT_METHODS = [
  { id: "sslcommerz", name: "SSLCommerz", icon: "💸" },
  { id: "bkash", name: "bKash", icon: "📱" },
  { id: "nagad", name: "Nagad", icon: "💰" },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["id"];

const CheckoutSection = () => {
  const { data: session } = useSession();
  const { cartItems, loading, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { distributions, getDistributionItems } = useDistributionStore();
  const { tools, getToolItems, updateTools } = useToolStore(); // Removed updateTools as it's not used directly in useEffect

  const [total, setTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("sslcommerz");
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState<string[]>([]);
  const [grantedTool, setGrantedTool] = useState<string[]>([]);
  const [grantedToolDetails, setGrantedToolDetails] = useState<{
    documentId?: string;
    totalOrder?: number;
  }>({});
  const [productCategory, setProductCategory] = useState("");
  const [productMonth, setProductMonth] = useState(0);
  const [showSupportMessage, setShowSupportMessage] = useState(false);

  // Memoized cart product details
  const cartProduct = useMemo(() => cartItems[0], [cartItems]);

  // Fetch data on mount only if session exists and data isn't already loaded
  useEffect(() => {
    if (session?.user?.email && distributions.length === 0) {
      getDistributionItems();
    }
    if (session?.user?.email) {
      getToolItems(); // Assuming getToolItems has similar optimization
    }
  }, [session?.user?.email, distributions.length, getDistributionItems, getToolItems]);

  // Calculate total when cartItems change
  useEffect(() => {
    if (!loading && cartItems) {
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + (Number(item?.price) || 0),
        0
      );
      setTotal(totalAmount);
    }
  }, [cartItems, loading]);

  // Handle tool selection logic (unchanged)
  useEffect(() => {
    if (!cartItems?.length) {
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

    setProducts(cartItems.map((item) => item?.documentId));
    setProductCategory(category);
    setProductMonth(month);

    const filteredTools = tools.filter(
      (tool) => tool?.category === category && tool?.month === month
    );

    const distributionTools = distributions.filter(
      (tool) => tool?.toolName === category
    );
    const MAX_TOOL_ORDERS = distributionTools?.[0]?.numberOfUser ?? 10;

    const availableTool = filteredTools.find(
      (tool) => (tool?.totalOrder || 0) < MAX_TOOL_ORDERS
    );

    if (availableTool) {
      setGrantedTool([availableTool.documentId]);
      setGrantedToolDetails({
        documentId: availableTool.documentId,
        totalOrder: availableTool.totalOrder || 0,
      });
      setShowSupportMessage(false);
    } else if (filteredTools.length > 1) {
      setGrantedTool([]);
      setGrantedToolDetails({});
      setShowSupportMessage(true);
    } else {
      setGrantedTool([]);
      setGrantedToolDetails({});
      setShowSupportMessage(true);
    }
  }, [cartItems, tools, cartProduct, distributions]);

  const createOrderAndUpdateCart = async () => {
    if (!session?.user?.email || !grantedToolDetails.documentId) return;

    try {
      await createOrder({
        data: {
          email: session.user.email,
          username: session.user.name || "",
          amount: total,
          products,
          category: productCategory,
          month: productMonth,
          tools: grantedTool,
        },
        productId: "",
        quantity: 0,
      });

      // Assuming updateTools is imported and used elsewhere
      await updateTools(grantedToolDetails.documentId, {
        totalOrder: (grantedToolDetails.totalOrder || 0) + 1,
      });

      clearCart();
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  const handleSSLCommerzPayment = async () => {
    if (!cartItems?.length || !session?.user || showSupportMessage) return;

    setIsProcessing(true);

    try {
      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: cartProduct?.title || "Product Purchase",
          product_category: cartProduct?.category || "General",
          amount: total.toString(),
          customer_name: session.user.name || "Customer",
          email: session.user.email,
          phone: "01711111111",
          address: "Bangladesh",
        }),
      });

      const data = await response.json();
      if (response.ok && data.url) {
        await createOrderAndUpdateCart();
        // window.location.href = data.url;
      } else {
        alert(data.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="App">
      <div className="relative mx-auto w-full bg-background/95 rounded-2xl">
        <div className="grid min-h-screen grid-cols-10">
          {/* Payment Section */}
          <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
            <div className="mx-auto w-full max-w-lg">
              <h1 className="relative text-2xl font-medium sm:text-3xl">
                Secure Checkout
                <span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20 rounded-r-2xl" />
              </h1>

              <div className="mt-6">
                <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                <div className="grid grid-cols-2 gap-4">
                  {PAYMENT_METHODS.map(({ id, name, icon }) => (
                    <button
                      key={id}
                      onClick={() => handlePaymentMethodChange(id)}
                      className={`p-4 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        selectedPayment === id
                          ? "border-teal-600 bg-teal-600/10"
                          : "border-gray-200 hover:border-teal-600"
                      }`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {total > 0 && (
                <div className="mt-6">
                  {selectedPayment === "sslcommerz" && (
                    <Button
                      onClick={handleSSLCommerzPayment}
                      disabled={isProcessing}
                      className="w-full p-2 mt-4 text-white rounded-md hover:bg-teal-800 bg-teal-600"
                    >
                      {isProcessing ? "Processing..." : "Pay with SSLCommerz"}
                    </Button>
                  )}

                  {["bkash", "nagad"].includes(selectedPayment) && (
                    <div className="p-4 bg-gray-100 rounded text-black">
                      <p>{selectedPayment} integration coming soon</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24">
            <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-teal-900 to-teal-600 opacity-95 rounded-r-2xl" />

            <div className="relative">
              <h2 className="sr-only">Order summary</h2>

              <ul className="space-y-5">
                {cartItems?.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <div className="inline-flex">
                      {item?.banner?.url && (
                        <Image
                          src={item?.banner?.url}
                          alt=""
                          height={100}
                          width={100}
                          className="h-16 w-[6rem] rounded object-cover"
                        />
                      )}
                      <div className="ml-3 flex flex-col items-start">
                        <h3 className="text-sm font-medium text-white line-clamp-1">
                          {item?.title}
                        </h3>
                        <dl className="mt-0.5 space-y-px text-[12px] text-gray-100">
                          <dd className="capitalize">{item?.category}</dd>
                          <dd>${item?.price}</dd>
                        </dl>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      ${item?.price}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="my-5 h-0.5 w-full bg-background/95 bg-opacity-30" />

              <div className="space-y-2">
                <p className="flex justify-between text-lg font-bold text-white">
                  <span>Total price:</span>
                  <span>${total}</span>
                </p>
              </div>
            </div>

            <div className="relative mt-10 text-white">
              <h3 className="mb-5 text-lg font-bold">Support</h3>
              <p className="text-sm font-semibold">
                +01776569369 <span className="font-light">(Bangladesh)</span>
              </p>
              <p className="mt-1 text-sm font-semibold">
                mdnhs.cse@gmail.com <span className="font-light">(Email)</span>
              </p>
              <p className="mt-2 text-xs font-medium">
                Call us now for payment related issues
              </p>
            </div>

            <div className="relative mt-10 flex">
              <p className="flex flex-col">
                <span className="text-sm font-bold text-white">
                  Money Back Guarantee
                </span>
                <span className="text-xs font-medium text-white">
                  within 30 days of purchase
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;

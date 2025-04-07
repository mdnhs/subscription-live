"use client";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { BallTriangle } from "react-loader-spinner";
import { useCartStore } from "@/_store/CartStore";
import { useSession } from "next-auth/react";
import CheckoutForm from "./CheckoutForm";
import Image from "next/image";
import { useOrderStore } from "@/_store/OrderStore";
import { Button } from "@/components/ui/button";

const CheckoutSection = () => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY as string
  );
  const { data: session } = useSession();
  const { carts, loading, getCartItems, deleteCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const [total, setTotal] = useState(0);
  const [options, setOptions] = useState({});
  const [selectedPayment, setSelectedPayment] = useState("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState<string[]>([]);
  const [productCategory, setProductCategory] = useState<string>("");
  const [productMonth, setProductMonth] = useState<number>(0);

  useEffect(() => {
    if (session?.user?.email) {
      getCartItems(session.user.email);
    }
  }, [getCartItems, session?.user?.email]);

  const createOrderAndUpdateCart = async () => {
    try {
      // Create the order
      await createOrder({
        data: {
          email: session?.user?.email,
          username: session?.user?.name,
          amount: Number(total),
          products: products,
          category: productCategory,
          month: productMonth,
        },
        productId: "",
        quantity: 0,
      });

      // Delete all cart items
      const deletePromises =
        carts?.map((item) => deleteCart(item?.documentId)) || [];
      await Promise.all(deletePromises);
      console.log("All cart items deleted successfully");

      // Refresh cart state
      if (session?.user?.email) {
        await getCartItems(session.user.email);
        console.log("Cart refreshed after deletion");
      }
    } catch (error) {
      console.error("Error in createOrderAndUpdateCart:", error);
      throw error; // Re-throw to handle in caller
    }
  };

  useEffect(() => {
    if (!carts?.length) {
      setProducts([]);
      setProductMonth(0);
      setProductCategory("");
      return;
    }

    setProducts(carts.map((item) => item?.products[0]?.documentId));
    setProductCategory(carts[0]?.products[0]?.category || "");
    setProductMonth(carts[0]?.products[0]?.month || 0);
  }, [carts]);

  useEffect(() => {
    if (!loading) {
      const totalAmount = carts?.reduce(
        (accumulator, currentValue) =>
          Number(accumulator) + Number(currentValue?.products[0]?.price),
        0
      );
      setTotal(totalAmount);
      setOptions({
        appearance: {
          theme: "night",
          labels: "floating",
        },
        mode: "payment",
        currency: "usd",
        amount: totalAmount * 100,
      });
    }
  }, [carts, loading]);

  const paymentMethods = [
    { id: "stripe", name: "Stripe", icon: "💳" },
    { id: "sslcommerz", name: "SSLCommerz", icon: "💸" },
    { id: "bkash", name: "bKash", icon: "📱" },
    { id: "nagad", name: "Nagad", icon: "💰" },
  ];

  const handlePaymentMethodChange = (method: string): void => {
    setSelectedPayment(method);
  };

  const handleSSLCommerzPayment = async () => {
    if (!carts?.length || !session?.user) return;

    setIsProcessing(true);

    const paymentData = {
      product_name: carts[0]?.products[0]?.title || "Product Purchase",
      product_category: carts[0]?.products[0]?.category || "General",
      amount: total.toString(),
      customer_name: session.user.name || "Customer",
      email: session.user.email,
      phone: "01711111111",
      address: "Bangladesh",
    };

    try {
      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      if (response.ok && data.url) {
        // Ensure cart is updated before redirecting
        await createOrderAndUpdateCart();
        window.location.href = data.url; 
      } else {
        alert(data.message || "Payment initiation failed");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Rest of your component remains unchanged
  return (
    <div className="App">
      <div className="relative mx-auto w-full bg-background/95 rounded-2xl">
        <div className="grid min-h-screen grid-cols-10">
          <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
            <div className="mx-auto w-full max-w-lg">
              <h1 className="relative text-2xl font-medium sm:text-3xl">
                Secure Checkout
                <span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20 rounded-r-2xl"></span>
              </h1>
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-4">
                  Select Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodChange(method.id)}
                      className={`p-4 border rounded-lg flex items-center justify-center gap-2 ${
                        selectedPayment === method.id
                          ? "border-teal-600 bg-teal-600/10"
                          : "border-gray-200 hover:border-teal-600"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span>{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              {total > 0 ? (
                <div className="mt-6">
                  {selectedPayment === "stripe" && (
                    <Elements stripe={stripePromise} options={options}>
                      <CheckoutForm amount={Number(total)} />
                    </Elements>
                  )}
                  {selectedPayment === "sslcommerz" && (
                    <div className="rounded">
                      <Button
                        onClick={handleSSLCommerzPayment}
                        disabled={isProcessing}
                        className="w-full p-2 mt-4 text-white rounded-md hover:bg-teal-800 bg-teal-600"
                      >
                        {isProcessing ? "Processing..." : "Pay with SSLCommerz"}
                      </Button>
                    </div>
                  )}
                  {selectedPayment === "bkash" && (
                    <div className="p-4 bg-gray-100 rounded text-black">
                      <p>bKash integration coming soon</p>
                    </div>
                  )}
                  {selectedPayment === "nagad" && (
                    <div className="p-4 bg-gray-100 rounded text-black">
                      <p>Nagad integration coming soon</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-[300px] flex justify-center items-center">
                  <BallTriangle
                    height={50}
                    width={50}
                    radius={5}
                    color="#319795"
                    ariaLabel="ball-triangle-loading"
                    visible={true}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24">
            <h2 className="sr-only">Order summary</h2>
            <div>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-teal-900 to-teal-600 opacity-95 rounded-r-2xl"></div>
            </div>
            <div className="relative">
              {!loading ? (
                <ul className="space-y-5">
                  {carts?.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <div className="inline-flex">
                        {item?.products[0]?.banner?.url && (
                          <Image
                            src={item?.products[0]?.banner?.url}
                            alt=""
                            height={100}
                            width={100}
                            className="h-16 w-[6rem] rounded object-cover"
                          />
                        )}
                        <div className="ml-3 marker:flex flex-col items-start">
                          <h3 className="text-sm font-medium text-start text-white line-clamp-1">
                            {item?.products[0]?.title}
                          </h3>
                          <dl className="mt-0.5 space-y-px font-medium text-[12px] text-gray-100">
                            <dd className="capitalize text-start">
                              {item?.products[0]?.category}
                            </dd>
                            <dd>${item?.products[0]?.price}</dd>
                          </dl>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        ${item?.products[0]?.price}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="w-full h-[300px] flex justify-center items-center">
                  <BallTriangle
                    height={80}
                    width={80}
                    radius={5}
                    color="#ffffff"
                    ariaLabel="ball-triangle-loading"
                    visible={true}
                  />
                </div>
              )}
              <div className="my-5 h-0.5 w-full bg-background/95 bg-opacity-30"></div>
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

"use client";
import { ToolsResponse } from "@/_types/product";
import PaymentMethods from "./PaymentMethods";
import OrderSummary from "./OrderSummary";
import SupportInfo from "./SupportInfo";
import useCheckout from "@/hooks/useCheckout";
import Loader from "../loader/Loader";

const CheckoutSection = ({ tools }: { tools: ToolsResponse[] }) => {
  const {
    loading,
    total,
    isProcessing,
    handleBkashPayment,
    selectedPayment,
    setSelectedPayment,
    showSupportMessage,
  } = useCheckout(tools);

  if (loading) return <Loader />;

  return (
    <div className="App">
      <div className="relative mx-auto w-full bg-brand-3/20 backdrop-blur-md rounded-2xl overflow-hidden">
        <div className="absolute bg-brand-1/30 -left-10 -top-10 h-40 w-40 rounded-full blur-3xl -z-10"></div>
        <div className="grid min-h grid-cols-10">
          <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
            <div className="mx-auto w-full max-w-lg">
              <h1 className="relative text-2xl font-medium sm:text-3xl">
                Secure Checkout
                <span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20 rounded-r-2xl" />
              </h1>
              <PaymentMethods
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
                handleBkashPayment={handleBkashPayment}
                isProcessing={isProcessing}
                total={total}
                showSupportMessage={showSupportMessage}
              />
            </div>
          </div>
          <div className="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24 border border-gray-200/15 rounded-2xl">
            <OrderSummary total={total} />
            <SupportInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;

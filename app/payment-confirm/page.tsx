import ConfirmPayment from "@/_components/confirmPayment/ConfirmPayment";
import { Suspense } from "react";

const Page = () => {
  return (
    <div className="h-screen pt-28 pb-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmPayment />
      </Suspense>
    </div>
  );
};

export default Page;

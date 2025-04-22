import { useCartStore } from "@/_store/CartStore";
import { Coupon } from "@/_types/coupon";
import { getProductPrice } from "@/function/priceFormatter";
import Image from "next/image";
import { useState } from "react";

interface OrderSummaryProps {
  total: number;
  applyCoupon: (couponCode: string) => boolean;
  removeCoupon: (couponCode: string) => void;
  appliedCoupons: Coupon[];
  couponError: string;
}

const OrderSummary = ({
  total,
  applyCoupon,
  removeCoupon,
  appliedCoupons,
  couponError,
}: OrderSummaryProps) => {
  const { cartItems } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      const success = applyCoupon(couponCode);
      if (success) {
        setCouponCode("");
      }
    }
  };

  return (
    <div className="relative">
      <h2 className="sr-only">Order summary</h2>
      <ul className="space-y-5">
        {cartItems?.map((item, idx) => (
          <li key={idx} className="flex justify-between">
            <div className="inline-flex">
              {item?.banner?.url && (
                <>
                  <Image
                    src={item.banner.url}
                    alt=""
                    height={100}
                    width={100}
                    className="h-16 w-[6rem] rounded object-cover"
                  />
                  <Image
                    src={item.banner.url}
                    alt=""
                    height={100}
                    width={100}
                    className="h-16 w-[6rem] absolute -left-2 -top-2 rounded object-cover blur-xl"
                  />
                </>
              )}
              <div className="ml-3 flex flex-col items-start">
                <h3 className="text-sm font-medium text-white line-clamp-1">
                  {item?.title}
                </h3>
                <dl className="mt-0.5 space-y-px text-[12px] text-gray-100">
                  <dd className="capitalize">{item?.category}</dd>
                  <dd>৳{getProductPrice(item)}</dd>
                </dl>
              </div>
            </div>
            <p className="text-sm font-semibold text-white">৳{getProductPrice(item)}</p>
          </li>
        ))}
      </ul>
      <div className="my-5 h-0.5 w-full bg-background/95 bg-opacity-30" />
      <div className="space-y-4">
        {/* Coupon Input */}
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 text-sm text-white bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <button
              onClick={handleApplyCoupon}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50"
              disabled={!couponCode.trim()}
            >
              Apply
            </button>
          </div>
          {couponError && <p className="text-sm text-red-500">{couponError}</p>}
          {appliedCoupons.map((coupon) => (
            <div
              key={coupon.code}
              className="flex justify-between items-center text-sm text-green-500"
            >
              <div>
                <p>
                  Coupon {coupon.code} applied! (
                  {coupon.isPercentage
                    ? `${coupon.discount}% off`
                    : `৳${coupon.discount} off`}
                  )
                </p>
                <p className="text-xs text-gray-400">
                  Expires: {new Date(coupon.expireDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => removeCoupon(coupon.code)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {/* Order Totals */}
        <div className="space-y-2">
          <p className="flex justify-between text-sm text-gray-100">
            <span>Subtotal:</span>
            <span>
              ৳
              {cartItems.reduce(
                (sum, item) => sum + (Number(getProductPrice(item)) || 0),
                0
              )}
            </span>
          </p>
          {appliedCoupons.length > 0 && (
            <p className="flex justify-between text-sm text-green-500">
              <span>Discount:</span>
              <span>
                -৳
                {appliedCoupons.reduce((total, coupon) => {
                  const subtotal = cartItems.reduce(
                    (sum, item) => sum + (Number(getProductPrice(item)) || 0),
                    0
                  );
                  const discount = coupon.isPercentage
                    ? Math.round((subtotal * coupon.discount) / 100)
                    : coupon.discount;
                  return total + discount;
                }, 0)}
              </span>
            </p>
          )}
          <p className="flex justify-between text-lg font-bold text-white">
            <span>Total price:</span>
            <span>৳{total}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

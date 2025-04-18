import useCartStore from "@/_store/CartStore";
import Image from "next/image";

interface OrderSummaryProps {
  total: number;
}

const OrderSummary = ({ total }: OrderSummaryProps) => {
  const { cartItems } = useCartStore();

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
                  <dd>৳{item?.price}</dd>
                </dl>
              </div>
            </div>
            <p className="text-sm font-semibold text-white">৳{item?.price}</p>
          </li>
        ))}
      </ul>
      <div className="my-5 h-0.5 w-full bg-background/95 bg-opacity-30" />
      <div className="space-y-2">
        <p className="flex justify-between text-lg font-bold text-white">
          <span>Total price:</span>
          <span>৳{total}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;

import { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/_store/CartStore";
import { useOrderStore } from "@/_store/OrderStore";

type Props = { amount: number };

const CheckoutForm = ({ amount }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { carts, getCartItems, deleteCart } = useCartStore();
  const { createOrder } = useOrderStore();

  const createOrderAndUpdateCart = async () => {
    await createOrder({
      data: {
        email: session?.user?.email,
        username: session?.user?.name,
        amount,
        products,
      },
      productId: "",
      quantity: 0,
    });

    await Promise.all(
      carts?.map((item) => {
        deleteCart(item?.documentId);
      })
    );

    if (session?.user?.email) {
      getCartItems(session.user.email);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const handleError = (error: unknown) => {
      setIsLoading(false);
      if (error instanceof Error) {
        setErrorMessage(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } else {
        setErrorMessage("An unknown error occurred");
      }
    };

    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: { amount: Number(amount) },
        }),
      });

      const data = await response.json();
      const clientSecret = data.clientSecret;

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      await createOrderAndUpdateCart();
      const result = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
          return_url: `${process.env.NEXTAUTH_URL}/payment-confirm`,
        },
      });

      if (result.error) {
        handleError(result.error);
      } else {
        console.log("Payment successful!");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const ProductsList = carts?.map((item) => item?.products?.[0]?.id);
    setProducts(ProductsList || []);
  }, [carts]);

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <PaymentElement />
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full p-2 mt-4 text-white rounded-md bg-teal-600"
      >
        {isLoading ? "Processing..." : "Submit"}
      </button>
    </form>
  );
};

export default CheckoutForm;

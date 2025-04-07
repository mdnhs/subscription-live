import { useOrderStore } from "@/_store/OrderStore";
import { useCartStore } from "@/_store/CartStore";

interface Product {
  documentId: string;
  title?: string;
  category?: string;
  month?: string | number;
  price?: number;
  banner?: { url?: string };
}

interface OrderData {
  email: string | null | undefined;
  username: string | null | undefined;
  amount: number | null | undefined;
  products: Product[];
  category?: string | null | undefined;
  month?: string | number | null | undefined;
}

export const createOrderAndUpdateCart = async (
  orderData: OrderData,
  cartItems: { documentId: string }[],
  userEmail: string
): Promise<void> => {
  const { createOrder } = useOrderStore.getState();
  const { deleteCart, getCartItems } = useCartStore.getState();

  try {
    // Create the order
    await createOrder({
      data: {
        email: orderData.email,
        username: orderData.username,
        amount: orderData.amount,
        products: orderData.products,
        category: orderData.category,
        month: orderData.month,
      },
      productId: "",
      quantity: 0,
    });

    // Delete all cart items
    const deletePromises = cartItems.map((item) => deleteCart(item.documentId));
    await Promise.all(deletePromises);

    // Refresh cart
    await getCartItems(userEmail);
  } catch (error) {
    console.error("Error in createOrderAndUpdateCart:", error);
    throw error; // Re-throw for handling in caller
  }
};
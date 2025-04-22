import { CartItem } from "@/_types/ordersTypes";
import { Product } from "@/_types/product";

export const getProductPrice = (product: Product | CartItem) => {
  return product?.isOffer
    ? product?.offerAmount.toLocaleString()
    : product?.price.toLocaleString() || 0;
};

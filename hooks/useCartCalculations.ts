import { CartItem } from "@/_store/CartStore";
import { ToolsResponse } from "@/_types/product";
import { useCallback, useMemo, useState } from "react";

const useCartCalculations = (
  cartItems: CartItem[],
  tools: ToolsResponse[],
  distributions: { toolName: string; numberOfUser: number }[]
) => {
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<string[]>([]);
  const [grantedTool, setGrantedTool] = useState<string[]>([]);
  const [grantedToolDetails, setGrantedToolDetails] = useState<{
    documentId?: string;
    totalOrder?: number;
  }>({});
  const [productCategory, setProductCategory] = useState("");
  const [productMonth, setProductMonth] = useState(0);
  const [showSupportMessage, setShowSupportMessage] = useState(false);

  const cartProduct = useMemo(() => cartItems[0], [cartItems]);

  const calculateTotal = useCallback(() => {
    const totalAmount = cartItems.reduce(
      (sum:number, item:CartItem) => sum + (Number(item?.price) || 0),
      0
    );
    setTotal(totalAmount);
  }, [cartItems]);

  const updateToolSelection = useCallback(() => {
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

    const filteredTools = Array.isArray(tools)
      ? tools.filter((tool) => tool?.category === category && tool?.month === month)
      : [];

    const distributionTools = distributions.filter(
      (tool) => tool?.toolName === category
    );
    const MAX_TOOL_ORDERS = distributionTools?.[0]?.numberOfUser ?? 10;

    const availableTool = filteredTools.find(
      (tool) => (tool?.totalOrder || 0) < MAX_TOOL_ORDERS
    );

    if (availableTool && availableTool.documentId) {
      setGrantedTool([availableTool.documentId]);
      setGrantedToolDetails({
        documentId: availableTool.documentId,
        totalOrder: availableTool.totalOrder || 0,
      });
      setShowSupportMessage(false);
    } else {
      setGrantedTool([]);
      setGrantedToolDetails({});
      // Set showSupportMessage to true if grantedToolDetails is empty or no documentId
      setShowSupportMessage(true);
    }
  }, [cartItems, cartProduct, distributions, tools]);

  return {
    total,
    products,
    grantedTool,
    grantedToolDetails,
    productCategory,
    productMonth,
    showSupportMessage,
    calculateTotal,
    updateToolSelection,
  };
};

export default useCartCalculations;
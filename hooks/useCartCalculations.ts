import { CartItem } from "@/_store/CartStore";
import { Coupon } from "@/_types/coupon";
import { ToolsResponse } from "@/_types/product";
import { getCoupon } from "@/services/api/couponRequest";
import useFetch from "@/services/fetch/csrFecth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const useCartCalculations = (
  cartItems: CartItem[],
  tools: ToolsResponse[],
  distributions: { toolName: string; numberOfUser: number }[]
) => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const [total, setTotal] = useState(0);
  const { fetchPublic } = useFetch();
  const [products, setProducts] = useState<string[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [grantedTool, setGrantedTool] = useState<string[]>([]);
  const [grantedToolDetails, setGrantedToolDetails] = useState<{
    documentId?: string;
    totalOrder?: number;
  }>({});
  const [productCategory, setProductCategory] = useState("");
  const [productMonth, setProductMonth] = useState(0);
  const [showSupportMessage, setShowSupportMessage] = useState(false);
  const [appliedCoupons, setAppliedCoupons] = useState<Coupon[]>([]); // Support multiple coupons if multiUse
  const [couponError, setCouponError] = useState<string>("");

  const cartProduct = useMemo(() => cartItems[0], [cartItems]);
  console.log(cartProduct,"+++");
  useEffect(() => {
    const debounceProcessCoupon = setTimeout(() => {
      const processCoupon = async () => {
        if (grantedTool.length === 0) return;

        try {
          const req = getCoupon();
          const response = await fetchPublic(req);

          if (!response.success) {
            throw new Error(response.message || "Failed to update Coupon.");
          }

          const { data } = response.data;
          setCoupons(data);
        } catch (error) {
          console.error("Coupon update error:", error);
          toast.error(
            (error instanceof Error
              ? error.message
              : "An unknown error occurred") || "Failed to update Coupon."
          );
        }
      };

      processCoupon();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceProcessCoupon);
  }, [grantedTool]);

  const calculateTotal = useCallback(() => {
    const subtotal = cartItems.reduce(
      (sum: number, item: CartItem) => sum + (Number(item?.price) || 0),
      0
    );

    let totalDiscount = 0;
    for (const coupon of appliedCoupons) {
      if (coupon.isValid) {
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
          setCouponError(
            `Minimum order amount is ৳${coupon.minOrderAmount} for ${coupon.code}.`
          );
          setAppliedCoupons([]);
          return;
        }
        const discount = coupon.isPercentage
          ? (subtotal * coupon.discount) / 100
          : coupon.discount;
        totalDiscount += discount;
      }
    }

    setTotal(Math.max(0, subtotal - totalDiscount));
    setCouponError("");
  }, [cartItems, appliedCoupons]);

  const validateCoupon = useCallback(
    (coupon: Coupon, isMultiUseApplication: boolean = false) => {
      const now = new Date();
      const startDate = new Date(coupon.startDate);
      const expireDate = new Date(coupon.expireDate);

      // Check if coupon is valid
      if (!coupon.isValid) {
        return { valid: false, error: "Coupon is invalid or disabled." };
      }

      // Check date validity
      if (now < startDate) {
        return { valid: false, error: "Coupon is not yet active." };
      }
      if (now > expireDate) {
        return { valid: false, error: "Coupon has expired." };
      }

      // Check total usage
      const usedCount = coupon?.usedCount ?? 0;
      if (usedCount >= coupon?.maxUsage) {
        return { valid: false, error: "Coupon usage limit reached." };
      }

      // Check one-time per user
      if (coupon.oneTimePerUser && userEmail) {
        const userUsage = coupon.userUsage?.[userEmail] || 0;
        if (userUsage > 0) {
          return { valid: false, error: "Coupon already used by this user." };
        }
      }

      // Check multi-use compatibility
      if (
        !coupon.multiUse &&
        isMultiUseApplication &&
        appliedCoupons.length > 0
      ) {
        return {
          valid: false,
          error: "This coupon cannot be combined with others.",
        };
      }

      return { valid: true, error: "" };
    },
    [userEmail, appliedCoupons]
  );

  const applyCoupon = useCallback(
    (couponCode: string) => {
      const coupon = coupons.find(
        (c) => c.code.toUpperCase() === couponCode.toUpperCase()
      );
      if (!coupon) {
        setCouponError("Invalid coupon code.");
        return false;
      }

      const validation = validateCoupon(coupon, appliedCoupons.length > 0);
      if (!validation.valid) {
        setCouponError(validation.error);
        return false;
      }

      setAppliedCoupons((prev) => {
        if (coupon.multiUse) {
          return [...prev, coupon];
        }
        return [coupon]; // Replace existing coupons if not multi-use
      });
      setCouponError("");
      calculateTotal();
      return true;
    },
    [calculateTotal, validateCoupon, appliedCoupons.length, coupons]
  );

  const removeCoupon = useCallback(
    (couponCode: string) => {
      setAppliedCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      setCouponError("");
      calculateTotal();
    },
    [calculateTotal]
  );

  const updateToolSelection = useCallback(() => {
    if (!cartItems?.length) {
      setProducts([]);
      setProductMonth(0);
      setProductCategory("");
      setGrantedTool([]);
      setGrantedToolDetails({});
      setShowSupportMessage(false);
      setAppliedCoupons([]);
      setCouponError("");
      return;
    }

    const category = cartProduct?.category || "";
    const month = cartProduct?.month || 0;

    setProducts(cartItems.map((item) => item?.documentId));
    setProductCategory(category);
    setProductMonth(month);

    const filteredTools = Array.isArray(tools)
      ? tools.filter(
          (tool) => tool?.category === category && tool?.month === month
        )
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
    appliedCoupons,
    couponError,
    applyCoupon,
    removeCoupon,
  };
};

export default useCartCalculations;

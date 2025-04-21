"use client";
import { getProducts } from "@/services/api/productRequest";
import useFetch from "@/services/fetch/csrFecth";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import CommonProductCard from "../products/CommonProductCard";
import { Product } from "@/_types/product";
import SectionHeader from "../ui/SectionHeader";
import { CircleDollarSign } from "lucide-react";

type Props = { refCredit: number };

const CreditMarket = (props: Props) => {
  const { fetchPublic } = useFetch();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        const req = getProducts();
        const response = await fetchPublic(req);
        if (!response.success) {
          throw new Error(response.message || "Get Distribution failed");
        }
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching distributions:", error);
        toast.error("Failed to fetch distribution data.");
      }
    };
    fetchDistributions();
  }, [fetchPublic]);
  return (
    <div className=" space-y-3">
      <div>
        <SectionHeader text="Credit Market" />{" "}
        <p className="flex items-center gap-2">
          <CircleDollarSign size={20} /> {props?.refCredit ?? 0}
        </p>
      </div>
      <div className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((product: Product, idx) => {
          return (
            product?.isCreditOffer &&
            !!props?.refCredit && (
              <CommonProductCard key={idx + "product"} isCredit product={product} />
            )
          );
        })}
      </div>
    </div>
  );
};

export default CreditMarket;

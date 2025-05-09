import React from "react";
import CommonProductCard from "../CommonProductCard";
import { Product } from "@/_types/product";

type Props = { products: Product[] };

const ProductWeb = (props: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {props?.products?.slice(0, 8)?.map((item, idx) => {
        return (
          !item?.isMobile && (
            <div key={idx + "products"}>
              <CommonProductCard product={item} />
            </div>
          )
        );
      })}
    </div>
  );
};

export default ProductWeb;

import { Product } from "@/_types/product";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import Banner from "./Banner";
import Details from "./Details";

interface ProductDetailsParams {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsParams) => {
  return (
    <div className="bg-background/95 text-white min-h-screen p-5 rounded-2xl space-y-5">
      <BreadCrumb PathName={product?.title}  />
      <div className="grid justify-around grid-cols-1 gap-5 md:gap-0 md:grid-cols-2">
        {product && <Banner product={product} />}
        {product && <Details product={product} />}
      </div>
    </div>
  );
};

export default ProductDetails;

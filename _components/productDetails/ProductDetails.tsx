import { Product } from "@/_types/product";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import Banner from "./Banner";
import Details from "./Details";
import ReviewSection from "./ReviewSection";

interface ProductDetailsParams {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsParams) => {
  return (
    <div className=" bg-brand-3/40 backdrop-blur-xl text-white min-h-screen p-5 rounded-2xl space-y-5 overflow-hidden">
      <BreadCrumb PathName={product?.title}  />
      <div className="grid justify-around grid-cols-1 gap-5 md:grid-cols-2 md:gap-10">
        {product && <Banner product={product} />}
        {product && <Details product={product} />}
        {product && <ReviewSection product={product} />}
      </div>
    </div>
  );
};

export default ProductDetails;

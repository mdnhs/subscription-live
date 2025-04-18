import { FallbackImage } from "../container/FallbackImage";

interface product {
  banner?: {
    url?: string;
  };
}

const Banner = ({ product }: { product: product }) => {
  return (
    <div>
      {product?.banner?.url ? (
        <div className="h-full w-full relative">
          <FallbackImage
            src={product?.banner?.url}
            alt="product-details-banner"
            imgClassName="rounded-lg h-full w-full "
            className="h-[400px] w-full absolute -top-20 -z-10 -left-40 opacity-50 blur-3xl"
          />
          <FallbackImage
            src={product?.banner?.url}
            alt="product-details-banner"
            imgClassName="rounded-lg h-full w-full "
            className="h-[400px] w-full"
          />
        </div>
      ) : (
        <div className="w-[400px] h-[225px] bg-slate-200 rounded-lg animate-pulse"></div>
      )}
    </div>
  );
};

export default Banner;

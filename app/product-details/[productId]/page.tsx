// app/product-details/[productId]/page.tsx
import ProductDetails from "@/_components/productDetails/ProductDetails";

const Page = async ({ params }: { params: Promise<{ productId: string }> }) => {
  const resolvedParams = await params; // Await the Promise
  return (
    <div className="container py-5">
      <ProductDetails productId={resolvedParams.productId} />
    </div>
  );
};

export default Page;

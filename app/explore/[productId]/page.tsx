import ProductDetails from "@/_components/productDetails/ProductDetails";
import { getProductById } from "@/services/api/productRequest";
import { fetchPublic } from "@/services/fetch/ssrfetchPublic";

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ productId: string }>; // Type params as a Promise
}>) {
  const resolvedParams = await params; // Explicitly await params
  const productId = resolvedParams.productId; // Access productId safely

  let productsDetails = null;
  try {
    const req = getProductById(productId); // Use the resolved productId
    const res = await fetchPublic(req);

    // Extract and filter the data
    productsDetails = res.data ?? null;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  if (!productsDetails) {
    return (
      <div className="container py-5">
        <p>Product not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <ProductDetails product={productsDetails} />
    </div>
  );
}
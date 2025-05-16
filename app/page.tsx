// app/page.tsx
import ProductSection from "@/_components/products/ProductSection";
import LandingHero from "@/components/landing/LandingHero";
import { LandingSectionOne } from "@/components/landing/LandingSectionOne";
import { LandingSectionTwo } from "@/components/landing/LandingSectionTwo";
import { getProducts } from "@/services/api/productRequest";
import { fetchPublic } from "@/services/fetch/ssrFetch";

export default async function Home() {
  let products = [];
  try {
    const req = getProducts();
    const res = await fetchPublic(req);
    products = res?.data ?? [];
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="min-h-screen space-y-10">
      <div>
        <LandingHero />

        {/* Products Section with enhanced styling */}
        <section id="weekend-products" className="container text-center px-4">
          <ProductSection
            headline="Trending on this week"
            url="/market"
            products={products}
            type="week"
          />
        </section>
      </div>
      <LandingSectionOne products={products} />
      <LandingSectionTwo />

      <section id="products" className="container text-center px-4">
        <ProductSection
          headline="Buy your favorite one"
          url="/market"
          products={products}
          type="common"
        />
      </section>
      <section id="productMobile" className="container text-center px-4">
        <ProductSection
          headline="Subscription for Mobile"
          url="/market"
          products={products}
          type="mobile"
        />{" "}
      </section>
      <section id="productWeb" className="container text-center px-4">
        <ProductSection
          headline="Subscription for Web"
          url="/market"
          products={products}
          type="web"
        />{" "}
      </section>
    </main>
  );
}

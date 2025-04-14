// app/page.tsx
import ProductSection from "@/_components/products/ProductSection";
import LandingHero from "@/components/landing/LandingHero";
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
    <main className="min-h-screen space-y-5 ">
      <LandingHero />

      {/* Products Section with enhanced styling */}
      <section
        id="products"
        className="container text-center mx-auto px-4 py-16"
      >
        <div className="flex flex-col md:flex-row items-center  justify-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Our Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400 ">
              Explore our latest additions and bestsellers
            </p>
          </div>
        </div>
        <ProductSection products={products} />
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear what our customers have
            to say
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah J.",
                role: "Fashion Enthusiast",
                content:
                  "The quality of their products exceeded my expectations. Shipping was fast and the customer service team was extremely helpful.",
              },
              {
                name: "Michael T.",
                role: "Tech Geek",
                content:
                  "I've been shopping here for years and have never been disappointed. Their tech products are cutting edge and reasonably priced.",
              },
              {
                name: "Emma R.",
                role: "Interior Designer",
                content:
                  "The home decor items I purchased transformed my living space. The attention to detail and craftsmanship is exceptional.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  {testimonial.content}
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-indigo-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-white/90 mb-8">
              Subscribe to our newsletter and be the first to know about new
              products, exclusive offers, and promotions.
            </p>

            <form className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Subscribe
              </button>
            </form>

            <p className="text-white/70 text-sm mt-4">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates from our company.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

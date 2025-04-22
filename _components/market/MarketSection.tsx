"use client";
import { Product } from "@/_types/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import CommonProductCard from "../products/CommonProductCard";
import { getExpireDays } from "@/function/dateFormatter";

type SortOption =
  | "newest"
  | "oldest"
  | "price-high"
  | "price-low"
  | "name-az"
  | "name-za";

const MarketSection = ({ products }: { products: Product[] }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [instantDelivery, setInstantDelivery] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Extract unique categories and max price
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const maxPrice = Math.max(...products.map((product) => product.price), 1000);

  // Initialize price range on load
  useEffect(() => {
    if (products.length > 0) {
      const minProductPrice = Math.min(
        ...products.map((product) => product.price)
      );
      const maxProductPrice = Math.max(
        ...products.map((product) => product.price)
      );
      setPriceRange([minProductPrice, maxProductPrice]);
    }
  }, [products]);

  // Apply filters when dependencies change
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          (product.description &&
            product.description.some(
              (desc) =>
                typeof desc === "object" &&
                desc.children &&
                desc.children.some(
                  (child) =>
                    child.text && child.text.toLowerCase().includes(query)
                )
            ))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.category && selectedCategories.includes(product.category)
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Instant delivery filter
    if (instantDelivery) {
      filtered = filtered.filter((product) => product.instantDelivery);
    }

    // Month filter
    if (selectedMonth !== null) {
      filtered = filtered.filter((product) => product.month === selectedMonth);
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "name-az":
          return a.title.localeCompare(b.title);
        case "name-za":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setIsFiltering(
      searchQuery !== "" ||
        selectedCategories.length > 0 ||
        priceRange[0] > 0 ||
        priceRange[1] < maxPrice ||
        instantDelivery ||
        selectedMonth !== null ||
        sortBy !== "newest"
    );
  }, [
    products,
    searchQuery,
    sortBy,
    priceRange,
    selectedCategories,
    instantDelivery,
    selectedMonth,
    maxPrice,
  ]);

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedCategories([]);
    setInstantDelivery(false);
    setSelectedMonth(null);
    setSearchQuery("");
    setSortBy("newest");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 ">
      {/* Mobile Filter Button */}
      <div className="md:hidden flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {isFiltering && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <FilterContent
              categories={categories}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategories={selectedCategories}
              handleCategoryChange={toggleCategory}
              instantDelivery={instantDelivery}
              setInstantDelivery={setInstantDelivery}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block w-[300px] space-y-6 bg-brand-1/[3%] border rounded-2xl border-gray-50/20 p-5 backdrop-blur-sm h-fit relative overflow-hidden">
        <div className="absolute bg-brand-1/30 -left-10 -top-10 h-40 w-40 rounded-full blur-3xl -z-10"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={!isFiltering}
          >
            Clear all
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <FilterContent
          categories={categories}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedCategories={selectedCategories}
          handleCategoryChange={toggleCategory}
          instantDelivery={instantDelivery}
          setInstantDelivery={setInstantDelivery}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-40 !h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="name-az">Name: A to Z</SelectItem>
                <SelectItem value="name-za">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active filters */}
          {isFiltering && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">
                Active Filters:
              </span>
              {selectedCategories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {category}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  />
                </Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <Badge variant="secondary">
                  Price: {formatPrice(priceRange[0])} -{" "}
                  {formatPrice(priceRange[1])}
                </Badge>
              )}
              {instantDelivery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Instant Delivery
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setInstantDelivery(false)}
                  />
                </Badge>
              )}
              {selectedMonth !== null && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedMonth} Month{selectedMonth > 1 ? "s" : ""}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedMonth(null)}
                  />
                </Badge>
              )}
              {isFiltering && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="ml-auto text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProducts.length > 0 ? (
            filteredProducts
              .sort((a, b) => (b.isOffer ? 1 : 0) - (a.isOffer ? 1 : 0))
              .map((product) => (
                <CommonProductCard key={product.id} product={product} />
              ))
          ) : (
            <div className="col-span-full text-center p-8 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search or filters
              </p>
              <Button className="mt-4" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterContent = ({
  categories,
  priceRange,
  setPriceRange,
  selectedCategories,
  handleCategoryChange,
  instantDelivery,
  setInstantDelivery,
  selectedMonth,
  setSelectedMonth,
}: any) => (
  <Accordion
    type="multiple"
    className="space-y-6"
    defaultValue={["price", "category", "delivery", "month"]}
  >
    {/* Price Filter */}
    <AccordionItem value="price">
      <AccordionTrigger>Price Range</AccordionTrigger>
      <AccordionContent>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={1000}
          step={10}
          className="w-full mt-2"
        />
        <div className="flex justify-between text-sm mt-2">
          <span>৳{priceRange[0]}</span>
          <span>৳{priceRange[1]}</span>
        </div>
      </AccordionContent>
    </AccordionItem>

    {/* Category Filter */}
    <AccordionItem value="category">
      <AccordionTrigger>Category</AccordionTrigger>
      <AccordionContent className="space-y-2">
        {categories.map((category: string) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={category}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => handleCategoryChange(category)}
            />
            <label htmlFor={category} className="text-sm">
              {category}
            </label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>

    {/* Instant Delivery */}
    <AccordionItem value="delivery">
      <AccordionTrigger>Delivery</AccordionTrigger>
      <AccordionContent>
        <div className="flex items-center space-x-2">
          <Switch
            id="instant-delivery"
            checked={instantDelivery}
            onCheckedChange={setInstantDelivery}
          />
          <label htmlFor="instant-delivery" className="text-sm">
            Instant Delivery Only
          </label>
        </div>
      </AccordionContent>
    </AccordionItem>

    {/* Month Filter */}
    <AccordionItem value="month">
      <AccordionTrigger>Duration</AccordionTrigger>
      <AccordionContent className="flex flex-wrap gap-2">
        {[0.33, 0.66, 1, 3, 6, 12].map((month) => (
          <Button
            key={month}
            variant={selectedMonth === month ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setSelectedMonth((prev: number | null) =>
                prev === month ? null : month
              )
            }
          >
            {month} Month{month > 1 ? "s" : ""} ({getExpireDays(month)})
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default MarketSection;

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { getExpireDays } from "@/function/dateFormatter";

const FilterContent = ({
  categories,
  months,
  priceRange,
  setPriceRange,
  selectedCategories,
  handleCategoryChange,
  instantDelivery,
  setInstantDelivery,
  isMobile,
  setIsMobile,
  selectedMonth,
  setSelectedMonth,
}: {
  categories: string[];
  months: number[];
  priceRange: number[];
  setPriceRange: (value: [number, number]) => void;
  selectedCategories: string[];
  handleCategoryChange: (category: string) => void;
  instantDelivery: boolean;
  setInstantDelivery: (value: boolean) => void;
  isMobile: boolean;
  setIsMobile: (value: boolean) => void;
  selectedMonth: number | null;
  setSelectedMonth: (value: number | null) => void;
}) => {
  return (
    <Accordion
      type="multiple"
      className="space-y-6"
      defaultValue={["price", "category", "delivery", "mobile", "month"]}
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

      {/* Fro Mobile */}
      <AccordionItem value="mobile">
        <AccordionTrigger>For Mobile</AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="is-mobile"
              checked={isMobile}
              onCheckedChange={setIsMobile}
            />
            <label htmlFor="is-mobile" className="text-sm">
              Mobile Access Only
            </label>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Month Filter */}
      <AccordionItem value="month">
        <AccordionTrigger>Duration</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2">
          {months?.map((month) => (
            <Button
              key={month}
              variant={selectedMonth === month ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSelectedMonth(selectedMonth === month ? null : month)
              }
            >
              {month} Month{month > 1 ? "s" : ""} ({getExpireDays(month)})
            </Button>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FilterContent;

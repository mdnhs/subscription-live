import { Product } from "@/_types/product";
import { Button } from "@/components/ui/button";
import CommonProductCard from "../products/CommonProductCard";

const FilteredProducts = ({
  filteredProducts,
  resetFilters,
}: {
  filteredProducts: Product[];
  resetFilters: () => void;
}) => {
  return (
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
  );
};

export default FilteredProducts;

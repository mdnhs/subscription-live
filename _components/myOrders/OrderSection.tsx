import { OrderResponse } from "@/_types/ordersTypes";
import { ToolsResponse } from "@/_types/product";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderCard from "./OrderCard";

const OrderSection = (orders: OrderResponse) => {
  return (
    <div className="min-h-screen bg-background/95 p-4 md:p-8 rounded-2xl">
      <div className="">
        <header className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            My Orders
          </h1>
          <p className="text-muted-foreground mt-2">
            View and access your purchased products
          </p>
        </header>

        {orders ? (
          <ScrollArea className="h-[70vh]">
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {orders?.orders?.map((item) =>
                item.tools.map((product: ToolsResponse, productIdx: number) => (
                  <OrderCard {...product} key={productIdx + "tools"} />
                ))
              )}
            </div>
          </ScrollArea>
        ) : (
          <EmptyOrderState />
        )}
      </div>
    </div>
  );
};

const EmptyOrderState = () => {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">No orders yet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          When you purchase products, they will appear here.
        </p>
        <Button className="mt-4">Browse Products</Button>
      </div>
    </Card>
  );
};

export default OrderSection;

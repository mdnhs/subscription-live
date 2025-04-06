"use client";

import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area"; // Shadcn ScrollArea
import { Card, CardContent } from "@/components/ui/card"; // Shadcn Card
import { Badge } from "@/components/ui/badge"; // Shadcn Badge
import { ShoppingCart } from "lucide-react";

// Define TypeScript interfaces based on your data structure
interface Product {
  documentId: string;
  banner: { url: string };
  title: string;
  category: string;
  price: number;
}

interface CartItem {
  id: string; // Assuming each cart item has an ID
  products: Product[];
}

interface CartPopoverProps {
  data: CartItem[];
}

const CartPopover = ({ data }: CartPopoverProps) => {
  return (
    <Card className="w-full max-w-sm border-none bg-gray-800 text-white shadow-lg dark:bg-gray-900 py-0">
      <CardContent className="p-4">
        <ScrollArea className="h-[300px] w-full">
          {data.length > 0 ? (
            <ul className="space-y-4">
              {data.map((item) => (
                <li
                  key={item.id + "data"}
                  className="flex items-center gap-4 border-b border-gray-700 pb-4 last:border-b-0"
                >
                  {item?.products?.[0]?.banner?.url ? (
                    <div className="relative h-16 w-20 flex-shrink-0">
                      <Image
                        src={item.products[0].banner.url}
                        alt={item.products[0].title || "Product image"}
                        fill
                        sizes="80px"
                        className="rounded-md object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-20 flex-shrink-0 rounded-md bg-gray-700 flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <h3 className="truncate text-sm font-medium text-white">
                      {item?.products?.[0]?.title || "Unnamed Product"}
                    </h3>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="capitalize bg-gray-700 text-gray-200 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {item?.products?.[0]?.category || "Uncategorized"}
                      </Badge>
                      <span className="text-sm font-semibold text-teal-400">
                        ৳{item?.products?.[0]?.price?.toLocaleString() || "0"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p className="text-sm">No items in cart</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CartPopover;
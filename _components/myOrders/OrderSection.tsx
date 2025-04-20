"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderResponse } from "@/_types/ordersTypes";
import { ToolsResponse } from "@/_types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import OrderCard from "./OrderCard";
import Link from "next/link";
import { updateTool } from "@/services/api/toolRequest";
import useFetch from "@/services/fetch/csrFecth";

type SortOption =
  | "newest"
  | "oldest"
  | "price-high"
  | "price-low"
  | "name-az"
  | "name-za";

const OrderSection = (orders: OrderResponse) => {
  const { fetchPublic } = useFetch();
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [archivedOrders, setArchivedOrders] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [filteredActive, setFilteredActive] = useState<any[]>([]);
  const [filteredArchived, setFilteredArchived] = useState<any[]>([]);
  const [filteredPending, setFilteredPending] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [processedExpiredIds, setProcessedExpiredIds] = useState<Set<string>>(new Set());

  // Extract all categories from orders
  const extractCategories = useCallback(() => {
    const categories = new Set<string>();

    if (orders?.orders) {
      orders.orders.forEach((order) => {
        if (order.isPaid && order.tools) {
          order.tools.forEach((product: ToolsResponse) => {
            if (product.category) {
              categories.add(product.category);
            }
          });
        }
      });
    }

    return Array.from(categories);
  }, [orders]);

  const availableCategories = extractCategories();

  // Handle sorting of orders
  const sortOrders = useCallback((orderList: any[]): any[] => {
    return [...orderList].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "name-az":
          return (a.name || "").localeCompare(b.name || "");
        case "name-za":
          return (b.name || "").localeCompare(a.name || "");
        default:
          return 0;
      }
    });
  }, [sortBy]);

  // Filter orders by search query and categories
  const filterOrders = useCallback((orderList: any[]) => {
    return orderList.filter((order) => {
      const matchesSearch =
        searchQuery === "" ||
        (order.name &&
          order.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.description &&
          order.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategories.length === 0 ||
        (order.category && selectedCategories.includes(order.category));

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategories]);

  // Handle expired order processing - separated from main useEffect
  const processExpiredOrder = useCallback(async (product: ToolsResponse) => {
    if (!product.documentId || processedExpiredIds.has(product.documentId)) {
      return;
    }

    try {
      // Only decrement if totalOrder is greater than 0
      if ((product?.totalOrder || 0) > 0) {
        const payload = {
          data: { totalOrder: (product?.totalOrder || 0) - 1 },
        };
        const request = updateTool(product.documentId, payload);
        await fetchPublic(request);
        
        // Mark this item as processed
        setProcessedExpiredIds(prev => {
          const updated = new Set(prev);
          if (product.documentId) {
            updated.add(product.documentId);
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to update expired tool totalOrder:", error);
    }
  }, [fetchPublic, processedExpiredIds]);

  // Process orders when data changes
  useEffect(() => {
    if (!orders?.orders) return;
    
    const currentDate = new Date();
    const active: any[] = [];
    const archived: any[] = [];
    const pending: any[] = [];

    orders.orders.forEach((order) => {
      if (!order.isPaid && order.tools) {
        // Handle pending orders
        order.tools.forEach((product: ToolsResponse) => {
          pending.push({
            ...product,
            orderId: order.id || Math.random().toString(36).substring(2), // Add order ID for uniqueness
            createdAt: order.createdAt || new Date().toISOString(),
          });
        });
      } else if (order.isPaid && order.tools) {
        // Check if the order is expired
        const expireDate = new Date(order.expireDate ?? 0);
        const isExpired = expireDate < currentDate;

        order.tools.forEach((product: ToolsResponse) => {
          const orderItem = {
            ...product,
            orderId: order.id || Math.random().toString(36).substring(2), // Add order ID for uniqueness
            expireDate: order.expireDate,
            createdAt: order.createdAt || new Date().toISOString(),
          };

          if (isExpired) {
            // Process expired item to decrement totalOrder
            processExpiredOrder(product);
            archived.push(orderItem);
          } else {
            active.push(orderItem);
          }
        });
      }
    });

    setPendingOrders(pending);
    setActiveOrders(active);
    setArchivedOrders(archived);
  }, [orders, processExpiredOrder]);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    setFilteredActive(sortOrders(filterOrders(activeOrders)));
    setFilteredArchived(sortOrders(filterOrders(archivedOrders)));
    setFilteredPending(sortOrders(filterOrders(pendingOrders)));
  }, [activeOrders, archivedOrders, pendingOrders, filterOrders, sortOrders]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSortBy("newest");
    setShowFilters(false);
  };

  // Generate a truly unique key for each order item
  const generateUniqueKey = (prefix: string, item: any, index: number) => {
    // Use a combination of prefix, documentId/orderId, and index to ensure uniqueness
    const itemId = item.documentId || item.id || '';
    const orderOrItemId = item.orderId || '';
    return `${prefix}-${itemId}-${orderOrItemId}-${index}`;
  };

  return (
    <Card className="shadow-md">
      <CardContent className="px-6">
        {orders ? (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 h-12">
              <TabsTrigger value="active">
                Active Orders
                {activeOrders.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 [background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF]"
                  >
                    {activeOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="archived">
                Archived Orders
                {archivedOrders.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 [background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF]"
                  >
                    {archivedOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending">
                Payment Pending
                {pendingOrders.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 [background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF]"
                  >
                    {pendingOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Search and filter controls */}
            <div className="mb-6 flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
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

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`${showFilters ? "bg-primary/10" : ""} h-12 w-12`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Category filters */}
              {showFilters && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium mr-2">Categories:</span>
                  {availableCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={
                        selectedCategories.includes(category)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                  {(searchQuery !== "" ||
                    selectedCategories.length > 0 ||
                    sortBy !== "newest") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="ml-auto text-xs"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}
            </div>

            <TabsContent value="active">
              {filteredActive.length > 0 ? (
                <ScrollArea className="h-fit">
                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredActive.map((product, index) => (
                      <OrderCard
                        {...product}
                        key={generateUniqueKey('active', product, index)}
                        expireDate={product.expireDate}
                        isActive
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : activeOrders.length > 0 ? (
                <Card className="p-8 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold">No matching orders</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search or filters
                    </p>
                    <Button className="mt-4" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </Card>
              ) : (
                <EmptyOrderState type="active" />
              )}
            </TabsContent>

            <TabsContent value="archived">
              {filteredArchived.length > 0 ? (
                <ScrollArea className="h-fit">
                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredArchived.map((product, index) => (
                      <OrderCard
                        {...product}
                        key={generateUniqueKey('archived', product, index)}
                        expireDate={product.expireDate}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : archivedOrders.length > 0 ? (
                <Card className="p-8 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold">No matching archived orders</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search or filters
                    </p>
                    <Button className="mt-4" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </Card>
              ) : (
                <EmptyOrderState type="archived" />
              )}
            </TabsContent>
            
            <TabsContent value="pending">
              {filteredPending.length > 0 ? (
                <ScrollArea className="h-fit">
                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPending.map((product, index) => (
                      <OrderCard
                        {...product}
                        key={generateUniqueKey('pending', product, index)}
                        expireDate={product.expireDate}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : pendingOrders.length > 0 ? (
                <Card className="p-8 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold">No matching pending orders</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search or filters
                    </p>
                    <Button className="mt-4" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </Card>
              ) : (
                <EmptyOrderState type="pending" />
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <EmptyOrderState type="all" />
        )}
      </CardContent>
    </Card>
  );
};

interface EmptyOrderStateProps {
  type: "active" | "archived" | "all" | "pending";
}

const EmptyOrderState = ({ type }: EmptyOrderStateProps) => {
  const messages = {
    active: {
      title: "No active orders",
      description: "You don't have any active product orders.",
    },
    archived: {
      title: "No archived orders",
      description: "You don't have any expired product orders.",
    },
    pending: {
      title: "No pending orders",
      description: "You don't have any orders awaiting payment.",
    },
    all: {
      title: "No orders yet",
      description: "When you purchase products, they will appear here.",
    },
  };

  return (
    <Card className="p-8 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">{messages[type].title}</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {messages[type].description}
        </p>
        <Link href="/market">
          <Button className="mt-4">Browse Products</Button>
        </Link>
      </div>
    </Card>
  );
};

export default OrderSection;
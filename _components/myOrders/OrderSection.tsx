"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderResponse } from "@/_types/ordersTypes";
import { ToolsResponse } from "@/_types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateTool } from "@/services/api/toolRequest";
import useFetch from "@/services/fetch/csrFecth";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useRef } from "react";
import OrderCard from "./OrderCard";

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
  const [failedOrders, setFailedOrders] = useState<any[]>([]);
  const [filteredActive, setFilteredActive] = useState<any[]>([]);
  const [filteredArchived, setFilteredArchived] = useState<any[]>([]);
  const [filteredFailed, setFilteredFailed] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [processedExpiredIds, setProcessedExpiredIds] = useState<Set<string>>(
    new Set()
  );
  const tabsListRef = useRef<HTMLDivElement>(null);

  // Tab configuration
  const tabConfig = [
    {
      value: "active",
      label: "Active Orders",
      orders: filteredActive,
      originalOrders: activeOrders,
      emptyType: "active" as const,
      isActive: true,
    },
    {
      value: "archived",
      label: "Archived Orders",
      orders: filteredArchived,
      originalOrders: archivedOrders,
      emptyType: "archived" as const,
      isActive: false,
    },
    {
      value: "failed",
      label: "Failed Orders",
      orders: filteredFailed,
      originalOrders: failedOrders,
      emptyType: "failed" as const,
      isActive: false,
    },
  ];

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
  const sortOrders = useCallback(
    (orderList: any[]): any[] => {
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
    },
    [sortBy]
  );

  // Filter orders by search query and categories
  const filterOrders = useCallback(
    (orderList: any[]) => {
      return orderList.filter((order) => {
        const matchesSearch =
          searchQuery === "" ||
          (order.name &&
            order.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (order.description &&
            order.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));

        const matchesCategory =
          selectedCategories.length === 0 ||
          (order.category && selectedCategories.includes(order.category));

        return matchesSearch && matchesCategory;
      });
    },
    [searchQuery, selectedCategories]
  );

  // Handle expired order processing
  const processExpiredOrder = useCallback(
    async (product: ToolsResponse) => {
      if (!product.documentId || processedExpiredIds.has(product.documentId)) {
        return;
      }

      try {
        if ((product?.totalOrder || 0) > 0) {
          const payload = {
            data: { totalOrder: (product?.totalOrder || 0) - 1 },
          };
          const request = updateTool(product.documentId, payload);
          await fetchPublic(request);

          setProcessedExpiredIds((prev) => {
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
    },
    [fetchPublic, processedExpiredIds]
  );

  // Process orders when data changes
  useEffect(() => {
    if (!orders?.orders) return;

    const currentDate = new Date();
    const active: any[] = [];
    const archived: any[] = [];
    const failed: any[] = [];

    orders.orders.forEach((order) => {
      if (!order.isPaid && order.tools) {
        failed.push({
          ...order,
          orderId: order.id || Math.random().toString(36).substring(2),
          createdAt: order.createdAt || new Date().toISOString(),
          products: order.products,
        });
      } else if (order.isPaid && order.tools) {
        const expireDate = new Date(order.expireDate ?? 0);
        const isExpired = expireDate < currentDate;

        order.tools.forEach((product: ToolsResponse) => {
          const orderItem = {
            ...product,
            orderId: order.id || Math.random().toString(36).substring(2),
            expireDate: order.expireDate,
            createdAt: order.createdAt || new Date().toISOString(),
          };

          if (isExpired) {
            processExpiredOrder(product);
            archived.push(orderItem);
          } else {
            active.push(orderItem);
          }
        });
      }
    });

    setFailedOrders(failed);
    setActiveOrders(active);
    setArchivedOrders(archived);
  }, [orders, processExpiredOrder]);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    setFilteredActive(sortOrders(filterOrders(activeOrders)));
    setFilteredArchived(sortOrders(filterOrders(archivedOrders)));
    setFilteredFailed(sortOrders(filterOrders(failedOrders)));
  }, [activeOrders, archivedOrders, failedOrders, filterOrders, sortOrders]);

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
    const itemId = item.documentId || item.id || "";
    const orderOrItemId = item.orderId || "";
    return `${prefix}-${itemId}-${orderOrItemId}-${index}`;
  };

  // Effect for handling tab indicator animation
  useEffect(() => {
    const tabsList = tabsListRef.current;
    if (!tabsList) return;

    const activeTab = tabsList.querySelector('[data-state="active"]');
    if (activeTab) {
      const { offsetWidth, offsetLeft } = activeTab as HTMLElement;
      tabsList.style.setProperty("--indicator-width", `${offsetWidth}px`);
      tabsList.style.setProperty("--indicator-left", `${offsetLeft}px`);
    }
  }, []);

  return (
    <Card className="shadow-md bg-brand-3/5 backdrop-blur-2xl">
      <CardContent className="px-6">
        {orders ? (
          <Tabs defaultValue="active" className="w-full">
            <TabsList
              ref={tabsListRef}
              className="relative mb-6 flex bg-muted/50 rounded-lg p-1 h-fit w-full"
              style={
                {
                  "--indicator-width": "0px",
                  "--indicator-left": "0px",
                } as React.CSSProperties
              }
            >
            
              {tabConfig.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative basis-1/3 h-12 px-4 text-sm font-medium transition-colors data-[state=active]:text-primary data-[state=active]:font-semibold hover:bg-muted/50 rounded-md z-10"
                >
                  {tab.label}
                  {tab.originalOrders.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 [background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF] text-white"
                    >
                      {tab.originalOrders.length}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
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
                    className="pl-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted"
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
                  <SelectTrigger className="w-40 !h-12 transition-all duration-200">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="name-az">Name: A to Z</SelectItem>
                    <SelectItem value="name-za">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-12 w-12 transition-all duration-200 ${
                    showFilters ? "bg-primary/10 ring-2 ring-primary" : ""
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Category filters */}
              {showFilters && (
                <div className="flex flex-wrap gap-2 items-center animate-in fade-in duration-300">
                  <span className="text-sm font-medium mr-2">Categories:</span>
                  {availableCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={
                        selectedCategories.includes(category)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer transition-all duration-200 hover:scale-105"
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
                      className="ml-auto text-xs hover:text-primary transition-colors"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Dynamic Tabs Content */}
            {tabConfig.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="animate-in fade-in duration-300"
              >
                {tab.orders.length > 0 ? (
                  <ScrollArea className="h-fit">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {tab.orders.map((item, index) => (
                        <div
                          key={generateUniqueKey(tab.value, item, index)}
                          className="animate-in fade-in zoom-in-95 duration-300"
                        >
                          {tab.value === "failed" ? (
                            item.products.map(
                              (
                                product: ToolsResponse,
                                productIndex: number
                              ) => (
                                <OrderCard
                                  key={generateUniqueKey(
                                    `failed-product-${item.orderId}`,
                                    product,
                                    productIndex
                                  )}
                                  {...product}
                                  expireDate={item.expireDate}
                                />
                              )
                            )
                          ) : (
                            <OrderCard
                              {...item}
                              expireDate={item.expireDate}
                              isActive={tab.isActive}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : tab.originalOrders.length > 0 ? (
                  <Card className="p-8 text-center animate-in fade-in duration-300">
                    <div className="mx-auto flex max-w-md flex-col items-center justify-center">
                      <h3 className="text-lg font-semibold">
                        No matching {tab.label.toLowerCase()}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Try adjusting your search or filters
                      </p>
                      <Button className="mt-4" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <EmptyOrderState type={tab.emptyType} />
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <EmptyOrderState type="all" />
        )}
      </CardContent>
    </Card>
  );
};

interface EmptyOrderStateProps {
  type: "active" | "archived" | "all" | "failed";
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
    failed: {
      title: "No failed orders",
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

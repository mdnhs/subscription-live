"use client";
import { FallbackImage } from "@/_components/container/FallbackImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { addRequestedTool, getRequestedTool } from "@/services/api/toolRequest";
import { fetchPublic } from "@/services/fetch/ssrFetch";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Reusable corner component
const CornerDecoration = ({
  position,
}: {
  position: "bottom-left" | "top-left" | "top-right" | "bottom-right";
}) => {
  const rotationMap = {
    "bottom-left": "rotate-0",
    "top-left": "rotate-90",
    "top-right": "rotate-180",
    "bottom-right": "-rotate-90",
  };

  const positionMap = {
    "bottom-left": "bottom-0 left-0",
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-right": "bottom-0 right-0",
  };

  return (
    <FallbackImage
      src="/icons/edge2.svg"
      alt={`${position} corner decoration`}
      imgClassName="rounded-lg h-full w-full object-contain"
      className={`h-10 w-10 absolute ${positionMap[position]} ${rotationMap[position]}`}
    />
  );
};

const ToolsRequest = () => {
  const [toolRequest, setToolRequest] = useState("");
  const [requestedTools, setRequestedTools] = useState<{ toolsName: string }[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize unique tool counts
  const toolCounts = useMemo(() => {
    return requestedTools.reduce((acc, item) => {
      const name = item.toolsName.trim().toLowerCase();
      if (name) {
        acc[name] = (acc[name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [requestedTools]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTool = toolRequest.trim();
    if (!trimmedTool) {
      toast.error("Please enter a tool name");
      return;
    }

    setIsSubmitting(true);
    const payload = { data: { toolsName: trimmedTool } };
    try {
      const req = addRequestedTool(payload);
      const res = await fetchPublic(req);
      if (!res.data) {
        toast.error(res.message || "Failed to submit tool request");
        return;
      }

      // Update tools list after successful submission
      setRequestedTools((prev) => [...prev, { toolsName: trimmedTool }]);
      setToolRequest("");
      toast.success("Tool request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("An error occurred while submitting");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const req = getRequestedTool();
        const res = await fetchPublic(req);
        if (res?.data) {
          setRequestedTools(res.data);
        } else {
          toast.error(res?.message || "Failed to fetch requested tools");
        }
      } catch (error) {
        console.error("Error fetching tools:", error);
        toast.error("An error occurred while fetching tools");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="container py-10 px-4">
      <div className="px-4 py-16 md:px-10 md:py-20 relative">
        {/* Decorative elements */}
        <FallbackImage
          src="/icons/style-line.svg"
          alt="Top decorative line"
          imgClassName="h-full w-full"
          className="h-8 w-1/3 md:h-10 absolute -top-5 left-1/2 -translate-x-1/2"
        />
        <FallbackImage
          src="/icons/style-line.svg"
          alt="Bottom decorative line"
          imgClassName="h-full w-full"
          className="h-8 w-1/3 md:h-10 absolute -bottom-5 left-1/2 -translate-x-1/2"
        />

        {/* Corner decorations */}
        <CornerDecoration position="bottom-left" />
        <CornerDecoration position="top-left" />
        <CornerDecoration position="top-right" />
        <CornerDecoration position="bottom-right" />

        <article className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-x-8 md:gap-y-14">
          <div className="md:col-span-6">
            <h1 className="text-xl md:text-2xl font-aboreto italic">
              <span className="font-bruno text-3xl md:text-5xl bg-gradient-to-t from-brand-1 via-brand-1 to-white bg-clip-text text-transparent">
                Request For New Tools
              </span>
            </h1>
          </div>

          <div className="md:col-span-6 md:row-span-2">
            <p className="text-base md:text-lg mb-4">
              We have a blog related to NFT so we can share thoughts and
              routines on our blog which is updated weekly.
            </p>
            {isLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </CardContent>
              </Card>
            ) : Object.keys(toolCounts).length > 0 ? (
              <Card className="bg-brand-3/20 backdrop-blur-xl text-white rounded-2xl">
                <CardContent>
                  <ScrollArea className="h-[200px] pr-4">
                    <ul className="list-disc flex flex-wrap gap-5">
                      {Object.entries(toolCounts).map(([name, count]) => (
                        <li key={name} className="text-base ml-4 mb-2">
                          {name} ({count})
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt.ConcurrentModificationException 6">
                  <p className="text-base text-muted-foreground">
                    No tools requested yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Input
                placeholder="Example: ChatGPT, Hix, Grok..."
                className="w-full h-12 rounded-full border-brand-6"
                value={toolRequest}
                onChange={(e) => setToolRequest(e.target.value)}
                aria-label="Enter tool name"
                required
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full text-lg font-semibold text-white h-12 px-6 whitespace-nowrap bg-gradient-to-r from-brand-1 to-brand-2"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ToolsRequest;

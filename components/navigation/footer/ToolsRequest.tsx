"use client";
import { useState } from "react";
import { FallbackImage } from "@/_components/container/FallbackImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Reusable corner component for DRY code
const CornerDecoration = ({ position }: { position: "bottom-left" | "top-left" | "top-right" | "bottom-right" }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!toolRequest.trim()) return;

    setIsSubmitting(true);
    try {
        // Implement your form submission logic here
        console.log("Tool requested:", toolRequest);
        // Reset form after successful submission
        setToolRequest("");
        // You would add API call here
    } catch (error) {
        console.error("Error submitting request:", error);
    } finally {
        setIsSubmitting(false);
    }
};

  return (
    <section className="container py-10 px-4">
      <div className="px-4 py-16 md:px-10 md:py-20 relative">
        {/* Decorative elements */}
        <FallbackImage
          src="/icons/style-line.svg"
          alt="Top decorative line"
          imgClassName="h-full w-full"
          className="h-8 w-1/3 md:h-10 absolute -top-5 left-1/2 transform -translate-x-1/2"
        />
        <FallbackImage
          src="/icons/style-line.svg"
          alt="Bottom decorative line"
          imgClassName="h-full w-full"
          className="h-8 w-1/3 md:h-10 absolute -bottom-5 left-1/2 transform -translate-x-1/2"
        />

        {/* Corner decorations using reusable component */}
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
            <p className="text-base md:text-lg">
              We have a blog related to NFT so we can share thoughts and
              routines on our blog which is updated weekly.
              <br />
              <br />
              We have a blog related to NFT so we can share thoughts and
              routines on our blog which is updated weekly.
              <br />
              <br />
              We have a blog related to NFT so we can share thoughts and
              routines on our blog which is updated weekly.
            </p>
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
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="[background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF] rounded-full text-lg font-semibold text-white h-12 px-6 whitespace-nowrap"
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

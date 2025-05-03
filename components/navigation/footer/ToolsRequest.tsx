import { FallbackImage } from "@/_components/container/FallbackImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const ToolsRequest = () => {
  return (
    <section className="container py-10 px-4 ">
      <div className="px-10 py-20 relative">
        <FallbackImage
          src={"/icons/style-line.svg"}
          imgClassName=" h-full w-full"
          className="h-10 w-1/3  absolute -top-5 left-1/2 transform -translate-x-1/2"
        />
        <FallbackImage
          src={"/icons/style-line.svg"}
          imgClassName=" h-full w-full"
          className="h-10 w-1/3 absolute -bottom-5 left-1/2 transform -translate-x-1/2"
        />
        <div>
          <FallbackImage
            src={"/icons/edge2.svg"}
            imgClassName="rounded-lg h-full w-full object-contain"
            className="h-10 w-10 absolute bottom-0 left-0"
          />
          <FallbackImage
            src={"/icons/edge2.svg"}
            imgClassName="rounded-lg h-full w-full object-contain"
            className="h-10 w-10 absolute top-0 left-0 rotate-90"
          />
          <FallbackImage
            src={"/icons/edge2.svg"}
            imgClassName="rounded-lg h-full w-full object-contain"
            className="h-10 w-10 absolute top-0 right-0 rotate-180"
          />
          <FallbackImage
            src={"/icons/edge2.svg"}
            imgClassName="rounded-lg h-full w-full object-contain"
            className="h-10 w-10 absolute bottom-0 right-0 -rotate-90"
          />
        </div>
        <article className="grid grid-cols-12 gap-x-8 gap-y-14">
          <div className=" col-span-6">
            <h1 className="md:text-2xl font-aboreto italic">
              <span className="font-bruno text-2xl md:text-5xl bg-gradient-to-t from-brand-1 via-brand-1 to-white bg-clip-text text-transparent">
                Request For New Tools
              </span>{" "}
            </h1>
          </div>
          <div className=" col-span-6 row-span-2">
            <p className="text-lg">
              We have a blog related to NFT so we can share thoughts and
              routines on our blog which is updated weekly. We have a blog
              related to NFT so we can share thoughts and routines on our blog
              which is updated weekly. <br />
              <br />
              We have a blog related to NFT so we can share thoughts and
              routines on our blog which is updated weekly.
            </p>
          </div>
          <div className=" col-span-6 flex gap-4">
            <Input
              placeholder="Example: ChatGPT, Hix, Grok..."
              className="w-full h-12 rounded-full border-brand-6"
            />
            <Button className="[background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF] rounded-full text-lg font-semibold text-white h-12 px-6">
              Submit
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ToolsRequest;

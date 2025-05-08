import React from "react";
import { Button } from "../ui/button";
import { FallbackImage } from "@/_components/container/FallbackImage";
import { Product } from "@/_types/product";
import CommonProductCard from "@/_components/products/CommonProductCard";

export const LandingSectionOne = ({ products }: { products: Product[] }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 container my-10 h-[600px]">
      <article className="relative">
        <FallbackImage
          src={"/images/monkey-bg.svg"}
          className=" h-[1500px] w-[1500px] -right-28 absolute -top-28 pointer-events-none"
        />
        <FallbackImage
          src={"/images/monkey-bg2.svg"}
          className=" h-full w-[800px] -z-10 absolute -left-32"
        />
        {products?.slice(0, 2)?.map((product, idx) => {
          const firstImgClass = "skew-x-8 top-48 left-12 -rotate-10 w-[250px]";
          const SecondImgClass = " -skew-x-12 w-[300px] right-48 top-20";
          return (
            <div
              key={product.id}
              className={` absolute ${
                idx === 0 ? firstImgClass : SecondImgClass
              }`}
            >
              <CommonProductCard product={product} />
            </div>
          );
        })}
      </article>
      <article className=" flex flex-col justify-center gap-4">
        <h1 className="md:text-2xl font-aboreto italic">
          {" "}
          <span className="font-bruno text-2xl md:text-5xl bg-gradient-to-t from-brand-1 via-brand-1 to-white bg-clip-text text-transparent">
            Modern Concept
          </span>{" "}
          <br />
          and{" "}
          <span className="font-bruno text-2xl md:text-5xl bg-gradient-to-t from-brand-1 via-brand-1 to-white bg-clip-text text-transparent">
            Clean
          </span>{" "}
        </h1>
        <FallbackImage
          src={"/images/curve.svg"}
          imgClassName="rounded-lg h-full w-full object-contain"
          className="h-[50px] w-1/2 "
        />
        <p className="text-lg">
          We strive to provide a secure, trusted, and accessible platform that
          makes it easy for anyone to get involved in the world of NFTs.
        </p>
        <Button className="[background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF] rounded-full text-lg font-semibold text-white h-12 px-6 w-fit">
          Go To Market
        </Button>
      </article>
    </section>
  );
};

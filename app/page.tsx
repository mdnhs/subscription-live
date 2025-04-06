import ProductSection from "@/_components/products/ProductSection";
import Image from "next/image";
import React from "react";

const Home = () => {
  return (
    <div className="container py-5 space-y-5">
      <div className=" bg-background/95 dark:bg-black h-96 w-full rounded-2xl flex justify-center items-center relative">
        {" "}
        <Image
          src={"/placeholder.svg"}
          fill
          alt=""
          className="object-cover rounded-2xl"
        />
      </div>
      <div>
        <ProductSection />
      </div>
    </div>
  );
};

export default Home;

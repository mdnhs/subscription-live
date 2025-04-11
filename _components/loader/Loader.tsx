"use client";
import React from "react";
import { BallTriangle } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="w-full h-[400px] flex justify-center items-center">
      <BallTriangle
        height={80}
        width={80}
        radius={5}
        color="#319795"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default Loader;

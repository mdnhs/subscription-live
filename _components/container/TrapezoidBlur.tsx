"use client";

import { cn } from "@/lib/utils";
import { FallbackImage } from "./FallbackImage";

export default function TrapezoidBlur({ className = "" }) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={{ aspectRatio: "556 / 483" }} // Enforce SVG aspect ratio
    >
      <FallbackImage
        src={"/images/1.svg"}
        className="h-[calc(100%+15%)] w-full z-50 absolute bottom-0 border-0"
        imgClassName="object-contain"
      />
      <FallbackImage
        src={"/images/1.svg"}
        className="h-[calc(100%+15%)] w-full z-40 absolute bottom-0 border-0 blur-3xl"
        imgClassName="object-contain"
      />
      {/* Container matching SVG dimensions */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blurred div with trapezoid clip-path */}
        <div
          className="absolute inset-0 backdrop-blur-2xl"
          style={{
            clipPath:
              "polygon(0.28% 0.35%, 86.79% 0.35%, 99.69% 99.65%, 13.15% 99.65%)",
          }}
        />
      </div>

      <svg
        width="556"
        height="483"
        viewBox="0 0 556 483"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <path
          d="M482.351 1.6794L554.289 481.306H73.0886L8.12239 48.1585L8.12161 48.1534L1.55847 1.6794H482.351Z"
          fill="#FAFAFA"
          fillOpacity="0.05"
        />
        <path
          d="M482.351 1.6794L554.289 481.306H73.0886L8.12239 48.1585L8.12161 48.1534L1.55847 1.6794H482.351Z"
          fill="none"
          stroke="url(#paint0_linear_2223_206)"
          strokeWidth="2.4"
        />
        <defs>
          <linearGradient
            id="paint0_linear_2223_206"
            x1="-27.1269"
            y1="-22.5073"
            x2="351.734"
            y2="339.264"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFA12B" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

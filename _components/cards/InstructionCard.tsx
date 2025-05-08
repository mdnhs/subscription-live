import React from "react";
import { FallbackImage } from "../container/FallbackImage";

type Props = {
  title: string;
  description: string;
  image: string;
  className?: string;
};

const InstructionCard = (props: Props) => {
  return (
    <div className="w-[250px] h-fit bg-brand-3 rounded-lg p-5 flex flex-col items-center justify-center gap-5 relative">
      <FallbackImage
        src={"/icons/edge.svg"}
        imgClassName="rounded-lg h-full w-full object-contain"
        className="h-10 w-10 absolute top-0 -right-2"
      />
      <FallbackImage
        src={"/icons/edge.svg"}
        imgClassName="rounded-lg h-full w-full object-contain"
        className="h-10 w-10 absolute bottom-0.5 -left-2 rotate-180"
      />
      <div className="bg-brand-1 rounded-lg p-2">
        {" "}
        <FallbackImage
          src={props.image}
          imgClassName="rounded-lg h-full w-full object-contain"
          className="h-12 w-12"
        />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="170"
        height="2"
        viewBox="0 0 170 2"
        fill="none"
      >
        <path
          d="M0.522705 1.13477H169.523"
          stroke="url(#paint0_linear_0_280)"
          strokeWidth="0.568534"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_0_280"
            x1="0.522705"
            y1="1.13477"
            x2="147.251"
            y2="44.8205"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="0.46875" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div>
        <h2 className="font-semibold text-xl pb-3">{props.title}</h2>
        <p>{props.description}</p>
      </div>
    </div>
  );
};

export default InstructionCard;

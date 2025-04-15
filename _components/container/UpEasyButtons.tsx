import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = { btnText: string; target: string };

export const BuyButton = (props: Props) => {
  return (
    <Link href={props?.target ?? "#"} className=" relative">
      <Button className="[background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF] rounded-full text-lg font-semibold text-white h-12 px-6">
        {props?.btnText}
      </Button>
    </Link>
  );
};

export const LinkButton = (props: Props) => {
  return (
    <Link href={props?.target ?? "#"}>
      <Button
        variant={"outline"}
        className="rounded-full text-lg font-semibold border border-brand-1 text-white h-12 px-6 italic"
      >
        {props?.btnText}
        <ArrowRight className="-rotate-45" />
      </Button>
    </Link>
  );
};

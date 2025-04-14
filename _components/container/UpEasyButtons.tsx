import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = { btnText: string; target: string };

export const BuyButton = (props: Props) => {
  return (
    <Link href={props?.target ?? "#"}>
      <Button className="[background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF] rounded-full text-lg font-semibold text-white h-12 px-6 cursor-pointer">
        {props?.btnText}
      </Button>
    </Link>
  );
};

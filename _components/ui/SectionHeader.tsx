import React from "react";

type Props = { text: string };

const SectionHeader = (props: Props) => {
  return (
    <h2 className="font-bold text-2xl font-bruno italic lowercase bg-gradient-to-t from-brand-1  to-white bg-clip-text text-transparent">
      {props?.text}
    </h2>
  );
};

export default SectionHeader;

import InstructionCard from "@/_components/cards/InstructionCard";
import { FallbackImage } from "@/_components/container/FallbackImage";
import ExtensionButton from "@/_components/extension/ExtensionButton";
import WatchTutorial from "@/_components/tutorial/WatchTutorial";

const instructionList = [
  {
    id: 1,
    title: "1. Create Account",
    description:
      "Create your collection. Add social links, profile and banner images, and set a secondary sales fee.",
    img: "/icons/create-user.svg",
  },
  {
    id: 2,
    title: "2. Install Extension",
    description:
      "Create your collection. Add social links, profile and banner images, and set a secondary sales fee.",
    img: "/icons/extension.svg",
  },
  {
    id: 3,
    title: "3. Buy Subscription",
    description:
      "Create your collection. Add social links, profile and banner images, and set a secondary sales fee.",
    img: "/icons/cart.svg",
  },
  {
    id: 4,
    title: "4. Enjoy Premium",
    description:
      "Create your collection. Add social links, profile and banner images, and set a secondary sales fee.",
    img: "/icons/premium.svg",
  },
];

export const LandingSectionTwo = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 container my-10 h-[600px]">
      <article className=" flex flex-col justify-center gap-4">
        <h1 className="md:text-2xl font-aboreto italic">
          {" "}
          <span className="font-bruno text-2xl md:text-5xl bg-gradient-to-t from-brand-1 via-brand-1 to-white bg-clip-text text-transparent">
            Create
          </span>{" "}
          <br />
          and{" "}
          <span className="font-bruno text-2xl md:text-5xl bg-gradient-to-t from-brand-1 via-brand-1 to-white bg-clip-text text-transparent">
            sell your NFTs
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
        <div className="flex gap-4 w-full">
          <ExtensionButton />
          <WatchTutorial />
        </div>
      </article>
      <article className="relative">
        <FallbackImage
          src={"/icons/star2.svg"}
          className=" h-60 w-60 z-40 -top-24 absolute -left-10 pointer-events-none"
        />
        <FallbackImage
          src={"/icons/star2.svg"}
          className=" h-60 w-60 z-40 -bottom-24 absolute right-2 pointer-events-none"
        />
        <FallbackImage
          src={"/images/monkey-bg.svg"}
          className=" h-[1500px] w-[1500px] -right-48 absolute -top-48 pointer-events-none -z-10"
        />
        <div className="grid grid-cols-2 gap-4 ">
          {instructionList?.map((item, idx) => {
            return (
              <div
                key={item.id}
                className={` -skew-12 ${
                  idx === 0
                    ? "ml-16"
                    : idx === 1
                    ? "ml-4"
                    : idx === 3
                    ? "-ml-12"
                    : ""
                } `}
              >
                <InstructionCard
                  title={item.title}
                  description={item.description}
                  image={item.img}
                />
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
};

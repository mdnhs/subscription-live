import { FallbackImage } from "@/_components/container/FallbackImage";
import TrapezoidBlur from "@/_components/container/TrapezoidBlur";
import {
  BuyButton,
  LinkButton,
} from "../../_components/container/UpEasyButtons";

const LandingHero = () => {
  return (
    <section className="container h-[calc(100vh-60vh)] md:h-[calc(100vh-40vh)]">
      <div className="flex gap-4 items-center h-full pt-20">
        <div className="basis-1/2 space-y-10">
          <h1 className="md:text-2xl font-aboreto">
            Experience the <br />{" "}
            <span className="font-bruno text-2xl md:text-5xl bg-gradient-to-t from-brand-1 via-brand-1 to-white bg-clip-text text-transparent">
              Next Generation
            </span>{" "}
            of <br />{" "}
            <span className="font-bruno text-2xl md:text-5xl bg-gradient-to-t from-brand-1 via-brand-1 to-white bg-clip-text text-transparent">
              Subscriptions
            </span>{" "}
            with us
          </h1>
          <div className="flex gap-4">
            <BuyButton btnText="Explore" target="#" />
            <LinkButton btnText="Go To Market" target="/market" />
          </div>
        </div>
        <div className="basis-1/2 relative h-full hidden md:block">
          <div className="h-full flex justify-center items-center">
            <FallbackImage
              src={"/images/monkey-bg2.svg"}
              className=" h-full w-[800px] z-10 absolute -right-40"
            />
            <TrapezoidBlur className="w-[400px] h-[350px] aspect-[556/483] absolute right-10 z-20" />
            <FallbackImage
              src={"/images/monkey-bg.svg"}
              className=" h-[1500px] w-[1500px] absolute -top-80 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;

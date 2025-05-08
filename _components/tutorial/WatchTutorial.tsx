import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const WatchTutorial = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-12 rounded-full">
          Watch Tutorial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1280px] py-3 px-0">
        <div className="container">
          <DialogHeader>
            <DialogTitle>Tutorial</DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-video py-3">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/YFstRtkLS38?si=k0JHElizCm8sqP6A"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WatchTutorial;

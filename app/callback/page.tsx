"use client";
import CallBackComponent from "@/_components/callback/CallBackComponent";
import React, { Suspense } from "react";

const CallBackPage = () => {
  return (
    <Suspense>
      <CallBackComponent />
    </Suspense>
  );
};

export default CallBackPage;

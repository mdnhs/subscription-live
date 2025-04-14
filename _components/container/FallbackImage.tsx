"use client";
import { FallbackImageTypes } from "@/_types/FallbackImageTypes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export const FallbackImage = ({
  src,
  height,
  width,
  alt = "default-image",
  quality = 75,
  className,
  imgClassName,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  placeholder = "empty",
  blurDataURL,
  fallbackSrc = "/placeholder.svg",
}: FallbackImageTypes & { fallbackSrc?: string }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const hasDimensions = Boolean(height && width);
  const defaultBlurData =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89R8AAtkB6zy+wn8AAAAASUVORK5CYII=";

  // Handle path formatting
  const validSrc =
    imgSrc && (imgSrc.startsWith("/") || imgSrc.startsWith("http"))
      ? imgSrc
      : `/${imgSrc || ""}`;

  const handleImageError = () => {
    setImgSrc(fallbackSrc);
    setHasError(true);
  };

  return (
    <div
      className={cn(
        "relative flex items-center",
        isLoading && "",
        className
      )}
    >
      <Image
        src={validSrc}
        alt={alt}
        {...(hasDimensions ? { width, height } : { fill: true, sizes })}
        className={cn("object-cover", hasError && "opacity-60", imgClassName)}
        onLoad={(event) => {
          const target = event.currentTarget;
          setIsLoading(false);
          if (target.naturalWidth === 0) {
            handleImageError();
          }
        }}
        onError={handleImageError}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={
          placeholder === "empty" ? undefined : blurDataURL || defaultBlurData
        }
      />
    </div>
  );
};

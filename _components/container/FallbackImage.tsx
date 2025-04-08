"use client";
import { FallbackImageTypes } from "@/_types/FallbackImageTypes";
import Image from "next/image";
import { useState } from "react";

export const FallbackImage = ({
  src,
  height,
  width,
  alt = "default-image",
  quality = 75,
  className = "",
  imgClassName = "",
  objectFit = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  placeholder = "empty",
  blurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89R8AAtkB6zy+wn8AAAAASUVORK5CYII=",
}: FallbackImageTypes) => {
  const [imgSrc, setImgSrc] = useState(src);
  const isHeightWidth = height && width;

  const validSrc =
    imgSrc?.startsWith("/") || imgSrc?.startsWith("http")
      ? imgSrc
      : `/${imgSrc}`;

  const handleImageError = () => setImgSrc("/placeholder.svg");

  return (
    <div className={`relative flex items-center ${className}`}>
      <Image
        src={validSrc}
        alt={alt}
        {...(isHeightWidth ? { width, height } : { fill: true, sizes })}
        className={`${
          isHeightWidth ? "" : objectFit ?? "object-cover"
        } ${imgClassName}`}
        onLoad={(event) => {
          const target = event.currentTarget as HTMLImageElement;
          if (target.naturalWidth === 0) {
            handleImageError();
          }
        }}
        onError={handleImageError}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholder === "empty" ? undefined : blurDataURL}
      />
    </div>
  );
};

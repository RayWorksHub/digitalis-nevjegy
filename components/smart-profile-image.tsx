"use client";

import Image from "next/image";
import { useState, type SyntheticEvent } from "react";

type SmartProfileImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  priority?: boolean;
};

type ImageFit = "cover" | "contain";

export function SmartProfileImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false
}: SmartProfileImageProps) {
  // Showing the complete image first avoids cropping wide logos while the
  // browser determines the source dimensions.
  const [fit, setFit] = useState<ImageFit>("contain");

  const detectBestFit = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const ratio = image.naturalWidth / image.naturalHeight;
    setFit(ratio >= 0.88 && ratio <= 1.12 ? "cover" : "contain");
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} smart-profile-image`}
      data-image-fit={fit}
      onLoad={detectBestFit}
      priority={priority}
    />
  );
}

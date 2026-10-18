/* eslint-disable @next/next/no-img-element -- remote template photos (Pexels); move to next/image when real assets exist */
import type { ImgHTMLAttributes } from "react";

// Plain lazy-loaded image used by the pages copied from the live site.
export function Photo({ alt = "", loading = "lazy", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img alt={alt} loading={loading} decoding="async" {...props} />;
}

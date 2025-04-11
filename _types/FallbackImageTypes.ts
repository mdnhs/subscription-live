export interface FallbackImageTypes {
  src: string;
  height?: number;
  width?: number;
  sizes?: string;
  alt?: string;
  quality?: number;
  className?: string;
  imgClassName?: string;
  objectFit?: string;
  placeholder?: "empty" | "blur";
  blurDataURL?: string;
}

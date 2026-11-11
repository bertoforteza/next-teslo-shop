import Image from "next/image";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>["className"];
  style?: React.StyleHTMLAttributes<HTMLImageElement>["style"];
  width: number;
  height: number;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  alt,
  height,
  width,
  className,
  src,
  style,
}) => {
  const buildLocalSrc = () => {
    if (src) {
      return src.startsWith("http") ? src : `/products/${src}`;
    } else {
      return "/imgs/placeholder.jpg";
    }
  };

  return (
    <Image
      src={buildLocalSrc()}
      width={width}
      height={height}
      alt={alt}
      className={className}
      style={style}
    />
  );
};

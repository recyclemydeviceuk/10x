import Image from 'next/image';
import type { ThemedImage } from './productMedia';

type Props = {
  src: ThemedImage;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export default function ThemedImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  priority,
  className = '',
}: Props) {
  const shared = { alt, fill, width, height, sizes, priority };
  return (
    <>
      <Image
        src={src.light}
        {...shared}
        className={`dark:hidden ${className}`}
      />
      <Image
        src={src.dark}
        {...shared}
        className={`hidden dark:block ${className}`}
      />
    </>
  );
}

import Image from "next/image";

export function ProductGallery({
  image,
  alt,
}: {
  image: string;
  alt: string;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}

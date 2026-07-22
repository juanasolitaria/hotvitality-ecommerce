import Image from "next/image";

import { cn } from "@/lib/utils";

// Shared brand mark used everywhere the logo shows up (storefront header,
// footer, login page, admin sidebar). Keeping it in one component means the
// image, size and shape only need to be changed here if the logo changes
// again later.
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.jpg"
      alt="Hot Vitality logo"
      width={40}
      height={40}
      className={cn("size-8 shrink-0 rounded-full object-cover", className)}
    />
  );
}

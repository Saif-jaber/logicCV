import Image from "next/image";

export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="logicCV logo"
      width={60}
      height={60}
      className={className}
    />
  );
}
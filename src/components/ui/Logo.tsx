import Image from "next/image";
import Link from "next/link";

type LogoSize = "sm" | "md";

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const sizeClasses: Record<
  LogoSize,
  {
    container: string;
    icon: string;
    text: string;
  }
> = {
  sm: {
    container: "gap-2 px-1",
    icon: "h-9 w-9",
    text: "text-xl",
  },
  md: {
    container: "gap-3 px-2",
    icon: "h-12 w-12",
    text: "text-3xl",
  },
};

export function Logo({
  size = "md",
  className = "",
}: LogoProps) {
  const styles = sizeClasses[size];

  return (
    <Link
      href="/"
      aria-label="BullChat"
      className={[
        "flex items-center",
        styles.container,
        className,
      ].join(" ")}
    >
      <Image
        src="/branding/bull-icon.png"
        alt=""
        width={48}
        height={48}
        priority
        className={`${styles.icon} object-contain`}
      />

      <span
        className={`${styles.text} font-bold tracking-tight text-white`}
      >
        Bull<span className="text-brand">Chat</span>
      </span>
    </Link>
  );
}
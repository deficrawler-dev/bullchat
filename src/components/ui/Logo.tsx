import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="BullChat"
      className="flex items-center gap-3 px-3"
    >
      <img
        src="/branding/bull-icon.png"
        alt="BullChat"
        className="h-12 w-12 object-contain"
      />

      <span className="text-3xl font-bold tracking-tight text-white">
        Bull<span className="text-brand">Chat</span>
      </span>
    </Link>
  );
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type FormLinkButtonProps = {
  href: string;
  label: string;
  locked?: boolean;
  lockedHref?: string;
};

export default function FormLinkButton({ href, label, locked, lockedHref }: FormLinkButtonProps) {
  const router = useRouter();

  if (locked) {
    return (
      <button
        type="button"
        onClick={() => router.push(lockedHref || "/login")}
        className="btn btn-full h-full min-h-[84px] md:min-h-[92px] lg:min-h-[96px] text-center transition-transform duration-200 bg-gray-500 text-white shadow-none hover:bg-gray-600"
      >
        <span className="font-medium inline-flex items-center justify-center gap-2 whitespace-normal break-words leading-snug">
          {label}
          <span className="material-symbols-rounded text-base opacity-90">lock</span>
        </span>
      </button>
    );
  }

  return (
    <Link
      href={href}
      className="btn btn-primary btn-full h-full min-h-[84px] md:min-h-[92px] lg:min-h-[96px] text-center transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
    >
      <span className="font-medium inline-flex items-center justify-center gap-2 whitespace-normal break-words leading-snug">
        {label}
        <span className="material-symbols-rounded text-base opacity-90">arrow_outward</span>
      </span>
    </Link>
  );
}

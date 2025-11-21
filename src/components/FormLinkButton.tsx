import Link from "next/link";

type FormLinkButtonProps = {
  href: string;
  label: string;
};

export default function FormLinkButton({ href, label }: FormLinkButtonProps) {
  return (
    <Link
      href={href}
      className="btn btn-primary btn-full h-full min-h-[84px] md:min-h-[92px] lg:min-h-[96px] text-center transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
    >
      <span className="font-medium inline-flex items-center justify-center gap-2 whitespace-normal break-words leading-snug">
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5 opacity-90"
          aria-hidden
        >
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

import type { ReactNode } from "react";

type InlineLink = {
  href: string;
  label?: string;
  target?: "_blank" | "_self";
  className?: string;
};

export function LinkedText({ text, links }: { text: string; links: Record<string, InlineLink> }) {
  const markerPattern = /\{\{([\w-]+)\}\}/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markerPattern.exec(text)) !== null) {
    const [marker, key] = match;
    const link = links[key];

    parts.push(text.slice(lastIndex, match.index));
    parts.push(
      link ? (
        <a
          key={`${key}-${match.index}`}
          href={link.href}
          target={link.target}
          rel={link.target === "_blank" ? "noreferrer" : undefined}
          className={link.className ?? "relative z-10 cursor-pointer pointer-events-auto font-medium text-primary underline decoration-primary underline-offset-2 transition-colors hover:text-foreground"}
        >
          {link.label ?? key}
        </a>
      ) : marker,
    );
    lastIndex = match.index + marker.length;
  }

  parts.push(text.slice(lastIndex));
  return <>{parts}</>;
}
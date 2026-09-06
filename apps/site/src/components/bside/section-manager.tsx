import type { ReactNode } from "react";

export function SectionManager({
  id,
  index,
  title,
  kicker,
  children,
  tone = "dark",
  noHeader = false,
  sectionClassName = "",
  panelClassName = "",
}: {
  id: string;
  index?: string;
  title?: string;
  kicker?: string;
  children: ReactNode;
  tone?: "dark" | "surface" | "paper";
  noHeader?: boolean;
  sectionClassName?: string;
  panelClassName?: string;
}) {
  const panel =
    tone === "paper"
      ? "bg-paper text-paper-foreground"
      : tone === "surface"
        ? "bg-surface text-foreground border border-border"
        : "bg-background text-foreground";

  return (
    <section id={id} className={`scroll-mt-24 px-2 py-2 sm:px-4 ${sectionClassName}`.trim()}>
      <div className={`mx-auto max-w-7xl rounded-panel px-4 py-14 sm:px-8 sm:py-14 ${panel} ${panelClassName}`.trim()}>
        {!noHeader && (
          <header className="mb-8 grid grid-cols-[auto_minmax(0,fr)] items-baseline gap-4 sm:mb-12">
            <span className="font-mono text-xs tracking-[0.25em] text-primary">{index}</span>
            <div className="min-w-0">
              <h2 className="text-4xl leading-[0.95] sm:text-6xl">{title}</h2>
              {kicker && (
                <p className="mt-2 max-w-2xl text-sm opacity-70 sm:text-base">{kicker}</p>
              )}
            </div>
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
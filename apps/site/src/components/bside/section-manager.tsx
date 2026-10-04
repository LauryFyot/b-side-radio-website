import type { ReactNode } from "react";

export function SectionManager({
  id,
  index,
  title,
  kicker,
  children,
  headerAction,
  tone = "dark",
  noHeader = false,
  sectionClassName = "",
  panelClassName = "",
}: {
  id: string;
  index?: string;
  title?: string;
  kicker?: ReactNode;
  children: ReactNode;
  headerAction?: ReactNode;
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
      <div className={`mx-auto max-w-7xl rounded-panel px-4 py-10 sm:px-8 sm:py-10 ${panel} ${panelClassName}`.trim()}>
        {!noHeader && (
          <header className={`mb-8 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-4 sm:mb-12 ${headerAction ? "relative z-10" : ""}`}>
            <span className="font-mono text-xs tracking-[0.25em] text-primary">{index}</span>
            <div className="min-w-0">
              <div className={headerAction ? "flex items-center justify-between gap-4" : undefined}>
                <h2 className="min-w-0 text-4xl leading-[0.95] sm:text-6xl">{title}</h2>
                {headerAction}
              </div>
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
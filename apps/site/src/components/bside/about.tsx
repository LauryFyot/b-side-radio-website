import { useI18n } from "@/lib/i18n";

export function About() {
  const { t } = useI18n();
  return (
    <section id="about" className="border-b border-border/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            {t("about.kicker")}
          </p>
          <h2 className="mt-4 text-5xl leading-[0.9] sm:text-7xl">
            {t("about.title.1")}
            <br />
            {t("about.title.2")}
            <br />
            {t("about.title.3")}
          </h2>
        </div>
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>{t("about.p1")}</p>
          <p>{t("about.p2")}</p>
          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
            {([
              ["24/7", "about.stat1"],
              ["0", "about.stat2"],
              ["3", "about.stat3"],
            ] as const).map(([n, key]) => (
              <div key={key}>
                <p className="font-display text-5xl leading-none text-primary">{n}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em]">{t(key)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

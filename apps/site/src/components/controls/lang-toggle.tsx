import { useI18n, type Lang } from "@/lib/i18n";

const flags: Record<Lang, string> = { fr: "🇫🇷", en: "🇬🇧" };

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();

  return (
    <>
      {/* Mobile: compact flag-only switch so it doesn't crowd the logo */}
      <button
        type="button"
        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
        aria-label={t("toggle.lang")}
        className={`grid size-8 shrink-0 place-items-center rounded-full border border-border text-sm sm:hidden ${className}`}
      >
        {flags[lang]}
      </button>

      {/* Tablet/desktop: full fr/en pill switch */}
      <button
        type="button"
        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
        aria-label={t("toggle.lang")}
        className={`hidden h-9 items-center gap-1 rounded-full border border-border px-1 font-mono text-[10px] uppercase tracking-[0.15em] sm:inline-flex ${className}`}
      >
        {(["fr", "en"] as const).map((l) => (
          <span
            key={l}
            className={`grid h-7 place-items-center rounded-full px-2.5 transition-colors ${
              lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {l}
          </span>
        ))}
      </button>
    </>
  );
}

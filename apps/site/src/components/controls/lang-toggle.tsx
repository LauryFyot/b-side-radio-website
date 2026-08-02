import { useI18n } from "@/lib/i18n";

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "fr" ? "en" : "fr")}
      aria-label={t("toggle.lang")}
      className={`inline-flex h-9 items-center gap-1 rounded-full border border-border px-1 font-mono text-[10px] uppercase tracking-[0.15em] ${className}`}
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
  );
}

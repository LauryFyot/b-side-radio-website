import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { socials } from "@/lib/bside-data";

const socialIcons: Record<string, typeof Instagram> = {
  Instagram: Instagram,
  Facebook: Facebook,
  "Twitter / X": Twitter,
  Mail: Mail,
};

// Footer section: social links and the final legal line.
export function Footer() {
  const { t } = useI18n();

  return (
    <footer id="socials" className="px-2 pb-4 pt-2 sm:px-4">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-paper px-5 pb-32 pt-14 text-paper-foreground sm:px-10">
        <h2 className="text-4xl leading-none sm:text-6xl">{t("socials.title")}</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {socials.map((social) => {
            const Icon = socialIcons[social.name];
            return (
              <li key={social.name}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-paper-foreground/15 p-6 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {Icon && <Icon className="size-6 shrink-0" aria-hidden />}
                  <span className="min-w-0">
                    <p className="font-display text-2xl leading-none">{social.name}</p>
                    <p className="mt-1 truncate font-mono text-[11px] tracking-widest opacity-70">{social.handle}</p>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
          {t("socials.legal")}
        </p>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionManager } from "./section-manager";
import { useI18n } from "@/lib/i18n";
import { team } from "@/lib/bside-data";

// Team section: static portraits and bios from local content.
export function Team() {
  const { t, lang } = useI18n();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionManager id="equipe" index="05" title={t("team.title")} kicker={t("team.kicker")} tone="paper">
      {/* Mobile accordion: first DJ open, others collapsed */}
      <div className="grid gap-3 sm:hidden">
        {team.map((member, index) => {
          const isOpen = openIndex === index;
          return (
            <article key={`${member.name}-${index}`} className="overflow-hidden rounded-[1.75rem] border border-paper-foreground/15">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 px-4 py-3 text-left"
              >
                <img
                  src={member.image}
                  alt={`${t("team.portrait")} ${member.name}`}
                  width={80}
                  height={80}
                  loading="lazy"
                  className="size-14 shrink-0 rounded-full object-cover grayscale"
                />
                <span className="min-w-0 flex-1">
                  <h3 className="truncate text-2xl leading-none">{member.name}</h3>
                  <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                    {lang === "en" ? member.roleEn : member.role}
                  </p>
                </span>
                <ChevronDown className={`size-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={member.image}
                      alt={`${t("team.portrait")} ${member.name}`}
                      width={800}
                      height={1000}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover grayscale"
                    />
                  </div>
                  <p className="mt-3 text-sm opacity-70">{lang === "en" ? member.bioEn : member.bio}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Desktop and tablet: all DJs on a single row */}
      <div className="hidden gap-6 sm:grid sm:grid-cols-4">
        {team.map((member, index) => (
          <article key={`${member.name}-${index}`} className="group">
            <div className="overflow-hidden rounded-[1.75rem]">
              <img
                src={member.image}
                alt={`${t("team.portrait")} ${member.name}`}
                width={800}
                height={1000}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
              />
            </div>
            <h3 className="mt-4 text-3xl leading-none">{member.name}</h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {lang === "en" ? member.roleEn : member.role}
            </p>
            <p className="mt-2 text-sm opacity-70">{lang === "en" ? member.bioEn : member.bio}</p>
          </article>
        ))}
      </div>
    </SectionManager>
  );
}

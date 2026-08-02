import { SectionManager } from "./section-manager";
import { useI18n } from "@/lib/i18n";
import { team } from "@/lib/bside-data";

// Team section: static portraits and bios from local content.
export function Team() {
  const { t, lang } = useI18n();

  return (
    <SectionManager id="equipe" index="05" title={t("team.title")} kicker={t("team.kicker")} tone="paper">
      <div className="grid gap-6 sm:grid-cols-3">
        {team.map((member) => (
          <article key={member.name} className="group">
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

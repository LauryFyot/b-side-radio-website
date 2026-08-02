import { SectionManager } from "./section-manager";
import { useI18n } from "@/lib/i18n";
import { useSiteContent } from "@/lib/siteContent";

// Videos section: weekly embedded YouTube videos.
export function Videos() {
  const { t, lang } = useI18n();
  const { videos } = useSiteContent();

  return (
    <SectionManager id="videos" index="06" title={t("videos.title")} tone="surface">
      <div className="grid gap-6 md:grid-cols-3">
        {videos.map((video) => {
          const title = lang === "en" ? video.titleEn : video.title;
          return (
            <figure key={video.id}>
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="size-full"
                />
              </div>
              <figcaption className="mt-3 font-display text-xl">{title}</figcaption>
            </figure>
          );
        })}
      </div>
    </SectionManager>
  );
}

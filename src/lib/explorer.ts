import "server-only";
import { getAnatomy, getArticles, getConditions } from "./content";
import type { ExplorerRegion } from "@/components/spine-explorer";

export function getExplorerData(): { intro: string; regions: ExplorerRegion[] } {
  const { intro, regions } = getAnatomy();
  const articles = getArticles();
  const conditions = getConditions();
  return {
    intro,
    regions: regions.map((r) => ({
      ...r,
      articleLinks: r.articles
        .map((s) => articles.find((a) => a.slug === s))
        .filter((a): a is NonNullable<typeof a> => !!a)
        .map((a) => ({ slug: a.slug, title: a.title })),
      conditionLinks: r.conditions
        .map((s) => conditions.find((c) => c.slug === s))
        .filter((c): c is NonNullable<typeof c> => !!c)
        .map((c) => ({ slug: c.slug, title: c.title })),
    })),
  };
}

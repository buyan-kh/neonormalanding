import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.neonorma.si";
  return ["/", "/thesis", "/contact", "/access"].map((path) => ({
    url: `${base}${path === "/" ? "/" : path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

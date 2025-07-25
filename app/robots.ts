import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/blog", "/contact", "/service"],
    },
    sitemap: "https://swasyn.tech/sitemap.xml",
  };
}

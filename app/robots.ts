import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://samcreds.debuguei.com.br";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

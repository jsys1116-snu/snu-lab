import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/admin", "/admin/", "/api/admin", "/api/admin/", "/studio-7f29", "/studio-7f29/"]
    }
  };
}

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vnoirs.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/admin/", "/auth/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

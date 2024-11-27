/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "https://mysecretsantas.com",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  outDir: "public",
  exclude: [
    "/blog/*", // Exclude blog pages from main sitemap
    "/server-sitemap.xml", // Exclude server sitemap
    "/api/*", // Exclude API routes
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  /** @type {(config: import('next-sitemap').ISitemapField, path: string) => Promise<import('next-sitemap').ISitemapField>} */
  transform: async (config, path) => {
    // Split URLs into different sitemaps based on path
    if (path.startsWith("/blog")) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: path === "/blog" ? 0.9 : 0.7,
        lastmod: new Date().toISOString(),
      };
    }

    // Check if it's a language-specific homepage (e.g., /de, /fr)
    const isLanguageHome = /^\/[a-z]{2}$/.test(path);

    return {
      loc: path,
      changefreq: path === "/" || isLanguageHome ? "daily" : "weekly",
      priority: path === "/" ? 1.0 : isLanguageHome ? 0.9 : 0.8,
      lastmod: new Date().toISOString(),
    };
  },
  // Sort URLs to prioritize language homepages
  /** @type {(urls: import('next-sitemap').ISitemapField[]) => import('next-sitemap').ISitemapField[]} */
  urlsFilter: (urls) =>
    urls.sort((a, b) => {
      // Put root URL first
      if (a.loc === "https://mysecretsantas.com") return -1;
      if (b.loc === "https://mysecretsantas.com") return 1;

      // Put language homepages next
      const aIsLang = /^https:\/\/mysecretsantas\.com\/[a-z]{2}$/.test(a.loc);
      const bIsLang = /^https:\/\/mysecretsantas\.com\/[a-z]{2}$/.test(b.loc);

      if (aIsLang && !bIsLang) return -1;
      if (!aIsLang && bIsLang) return 1;

      // Natural sort for the rest
      return a.loc.localeCompare(b.loc);
    }),
};

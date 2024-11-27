import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { i18n } from "../../next-i18next.config";
import { promises as fs } from "fs";
import path from "path";

type SitemapProps = {
  // Empty props since we're generating XML
};

async function getPages(dir: string): Promise<string[]> {
  const pagesDir = path.join(process.cwd(), dir);
  const files = await fs.readdir(pagesDir, { withFileTypes: true });
  const pages: string[] = [];

  for (const file of files) {
    if (file.isDirectory()) {
      // Skip api and internal Next.js directories
      if (!["api", "_"].some(prefix => file.name.startsWith(prefix))) {
        const subPages = await getPages(path.join(dir, file.name));
        pages.push(...subPages);
      }
    } else {
      const { name, ext } = path.parse(file.name);
      // Only include tsx/jsx files and skip internal Next.js files
      if ([".tsx", ".jsx"].includes(ext) && !name.startsWith("_") && !name.startsWith("[")) {
        const pagePath = path.join(dir, name === "index" ? "" : name);
        pages.push(pagePath.replace(/\\/g, "/"));
      }
    }
  }

  return pages;
}

export const getServerSideProps: GetServerSideProps<SitemapProps> = async (ctx) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://mysecretsantas.com";
  const languages = i18n.locales;
  const currentDate = new Date().toISOString();

  // Automatically discover pages from the pages directory
  const pages = await getPages("src/pages");
  const fields: ISitemapField[] = [];

  // Add discovered pages for all languages
  languages.forEach((lang) => {
    pages.forEach((page) => {
      fields.push({
        loc: `${baseUrl}${lang === "en" ? "" : `/${lang}`}${page}`,
        lastmod: currentDate,
        changefreq: "weekly",
        priority: page === "" ? 1.0 : 0.8,
      });
    });
  });

  return {
    props: {},
    ...(await getServerSideSitemap(fields)),
  };
};

export default function Sitemap(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Return null since this page is never rendered
  return null;
}

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import Image from "next/image";
import SEOMetadata from "../../components/SEOMetadata";
import { InferGetStaticPropsType } from "next";
import { motion } from "framer-motion";

const BlogIndex = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("blog");

  const posts = t("sections.posts", { returnObjects: true }) as {
    title: string;
    content: string;
    image: string;
    description: string;
    keywords: string[];
    date: string;
  }[];

  return (
    <div className="min-h-screen">
      <SEOMetadata
        title={t("meta.title")}
        description={t("meta.description")}
        keywords={t("meta.keywords")}
        metaStructuredDataName={t("meta.title")}
        metaStructuredDataDescription={t("meta.description")}
        metaStructuredDataFeatures={[]}
        ogSiteName={t("meta.title")}
        path="/blog"
      />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 rounded-3xl border border-gray-100 bg-gradient-to-br from-white/80 to-white/50 p-12 backdrop-blur-xl dark:border-gray-800 dark:from-gray-900/80 dark:to-gray-900/50">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:to-purple-400">
                {t("sections.title")}
              </h1>
              <p className="mt-4 text-xl leading-relaxed text-gray-600 dark:text-gray-400">
                {t("sections.blog.subtitle")}
              </p>
            </div>
            <Link
              href="/"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl dark:from-blue-500 dark:to-purple-500"
            >
              <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10" />
              <span className="relative flex items-center space-x-2">
                <span>{t("sections.callToAction.button")}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  {t("sections.callToAction.arrow")}
                </span>
              </span>
            </Link>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const slug = post.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/blog/${slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white/90 to-white/70 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:from-gray-900/90 dark:to-gray-900/70"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-500/10 dark:to-purple-500/10" />
                  <div className="relative">
                    <div className="aspect-[16/9] overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={`${post.image}`}
                          alt={post.title}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index < 3}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </motion.div>
                    </div>
                    <div className="p-6">
                      <div className="mb-2 flex items-center space-x-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {post.date}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-gray-600 dark:text-gray-300">
                        {post.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          {t("sections.readMore")}
                          <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">
                            {t("sections.callToAction.arrow")}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["blog"])),
    },
  };
};

export default BlogIndex;

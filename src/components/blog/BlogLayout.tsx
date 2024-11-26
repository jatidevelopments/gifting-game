import { useTranslation } from "next-i18next";
import Link from "next/link";
import SEOMetadata from "../SEOMetadata";
import { motion } from "framer-motion";

interface BlogLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  date?: string;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  children,
  title,
  description,
  keywords,
  image,
  date,
}) => {
  const { t } = useTranslation("blog");

  return (
    <div className="relative min-h-screen">
      <SEOMetadata
        title={title}
        description={description}
        keywords={keywords.join(", ")}
        image={image}
        metaStructuredDataName={t("meta.structuredData.name")}
        metaStructuredDataDescription={description}
        metaStructuredDataFeatures={[]}
        ogSiteName="MySecretSanta Blog"
      />

      {/* Blog Header */}
      <header className="sticky top-0 z-50 px-4 py-3">
        <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between">
              <Link
                href="/blog"
                className="group flex items-center space-x-3 rounded-xl border border-gray-100 bg-white/90 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:text-white"
              >
                <span className="text-gray-400 transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                <span>Back to Blog</span>
              </Link>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl dark:from-blue-500 dark:to-purple-500"
                >
                  <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10" />
                  <span className="relative flex items-center space-x-2">
                    <span>Start Gift Exchange</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <main className="relative z-10">
        <motion.article
          className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              {title}
            </h1>
            {date && (
              <p className="mb-6 text-md font-medium text-blue-600 dark:text-blue-400">
                {date}
              </p>
            )}
            {children}
          </div>
        </motion.article>
      </main>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
};

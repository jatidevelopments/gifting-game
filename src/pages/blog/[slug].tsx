import { motion } from "framer-motion";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { BlogLayout } from "../../components/blog/BlogLayout";

interface BlogPostProps {
  slug: string;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

const BlogPost = ({ slug }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("blog");
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const posts = t("sections.posts", { returnObjects: true }) as {
    title: string;
    content: string;
    image: string;
    description: string;
    keywords: string[];
  }[];

  const post = posts.find(
    (p) =>
      p.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") === slug,
  );

  if (!post) {
    return <div>Post not found</div>;
  }

  const description = post.content.slice(0, 160);

  const relatedPosts = posts.filter(
    (p) =>
      p.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") !== slug,
  );

  return (
    <BlogLayout
      title={post.title}
      description={description}
      keywords={post.keywords}
      date={currentDate}
    >
      <div className="mx-auto max-w-4xl">
        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 overflow-hidden rounded-3xl"
        >
          <div className="relative aspect-[21/9]">
            <Image
              src={post.image}
              alt={post.title}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="px-4 sm:px-6"
        >
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {post.title}
            </h1>
            <p className="mb-8 text-md font-medium text-blue-400">
              {t("sections.publishedOn")} {currentDate}
            </p>
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Call to Action */}
          <motion.div
            className="my-12 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white">
              {t("sections.callToAction.title")}
            </h3>
            <p className="mt-2 text-gray-200">
              {t("sections.callToAction.description")}
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
            >
              {t("sections.callToAction.button")}{" "}
              {t("sections.callToAction.arrow")}
            </Link>
          </motion.div>

          {/* Related Articles */}
          <motion.div
            className="my-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="mb-6 text-2xl font-bold text-white">
              {t("sections.relatedArticles")}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => {
                const relatedSlug = relatedPost.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");

                return (
                  <Link
                    key={index}
                    href={`/blog/${relatedSlug}`}
                    className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                          {relatedPost.title}
                        </h3>
                        <span className="ml-2 text-gray-400 transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                      <p className="line-clamp-2 text-gray-300">
                        {relatedPost.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {relatedPost.keywords
                          .slice(0, 2)
                          .map((keyword, idx) => (
                            <span
                              key={idx}
                              className="inline-block rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300"
                            >
                              {keyword}
                            </span>
                          ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog" className="text-blue-400 hover:text-blue-300">
                {t("sections.viewAll")} {t("sections.callToAction.arrow")}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </BlogLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const languages = [
    "en",
    "de",
    "fr",
    "da",
    "es",
    "it",
    "nl",
    "pl",
    "pt",
    "sv",
  ];
  const paths = locales.flatMap((locale) => {
    try {
      // Import the blog.json file for the current locale
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const blogJson = require(`../../../public/locales/${locale}/blog.json`);
      const posts = blogJson.sections.posts as {
        title: string;
        content: string;
        image: string;
        description: string;
        keywords: string[];
      }[];

      // Create paths for each post in the current locale
      return posts.map((post) => ({
        params: {
          slug: post.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        },
        locale,
      }));
    } catch (error) {
      console.warn(`Blog posts not found for locale: ${locale}`);
      return [];
    }
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostProps, Params> = async ({
  params,
  locale,
}) => {
  if (!params?.slug) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug: params.slug,
      ...(await serverSideTranslations(locale ?? "en", ["blog", "common"])),
    },
  };
};

export default BlogPost;

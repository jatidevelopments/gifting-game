import { motion } from "framer-motion";
import { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { SocialShareButtons } from "~/components/SocialShareButtons";
import { api } from "~/utils/api";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SEOMetadata from "~/components/SEOMetadata";

const features = [
  {
    emoji: "🎁",
    titleKey: "features.setup.title",
    descriptionKey: "features.setup.description",
  },
  {
    emoji: "🎯",
    titleKey: "features.matching.title",
    descriptionKey: "features.matching.description",
  },
  {
    emoji: "✨",
    titleKey: "features.ideas.title",
    descriptionKey: "features.ideas.description",
  },
  {
    emoji: "🔒",
    titleKey: "features.privacy.title",
    descriptionKey: "features.privacy.description",
  },
];

const howItWorks = [
  {
    step: 1,
    titleKey: "howItWorks.step1.title",
    descriptionKey: "howItWorks.step1.description",
    icon: "🎯",
  },
  {
    step: 2,
    titleKey: "howItWorks.step2.title",
    descriptionKey: "howItWorks.step2.description",
    icon: "👥",
  },
  {
    step: 3,
    titleKey: "howItWorks.step3.title",
    descriptionKey: "howItWorks.step3.description",
    icon: "🎁",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const LandingPage: NextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const router = useRouter();
  const { t } = useTranslation("home");
  const url = typeof window !== "undefined" ? window.location.href : "";

  const createGameRoom = api.gameRoom.create.useMutation({
    onSuccess: (data: any) => {
      void router.push(`/game/${data.id}/participants`);
    },
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MySecretSanta",
    applicationCategory: "LifestyleApplication",
    description:
      "MySecretSanta is the perfect web app for organizing Secret Santa gift exchanges. Create groups, add participants, and let our app handle the gift assignments while keeping everything fun and secret!",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Create gift exchange groups",
      "Add magic words for personalized suggestions",
      "Automatic gift pair matching",
      "Private links for participants",
      "Free to use",
    ],
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SEOMetadata
        title={t("meta.title")}
        description={t("meta.description")}
        keywords={t("meta.keywords")}
        metaStructuredDataName={t("meta.structuredData.name")}
        metaStructuredDataDescription={t("meta.structuredData.description")}
        metaStructuredDataFeatures={
          t("meta.structuredData.features", {
            returnObjects: true,
          }) as string[]
        }
        metaStructuredDataAlternateNames={
          t("meta.structuredData.alternateNames", {
            returnObjects: true,
          }) as string[]
        }
        metaStructuredDataApplicationCategory={t(
          "meta.structuredData.applicationCategory",
        )}
        metaStructuredDataOperatingSystem={t(
          "meta.structuredData.operatingSystem",
        )}
        metaStructuredDataOffersPrice={t("meta.structuredData.offers.price")}
        metaStructuredDataOffersCurrency={t(
          "meta.structuredData.offers.currency",
        )}
        metaStructuredDataAuthorName={t("meta.structuredData.author.name")}
        metaStructuredDataAuthorUrl={t("meta.structuredData.author.url")}
        screenshots={
          t("meta.structuredData.screenshots", {
            returnObjects: true,
          }) as any[]
        }
        ogSiteName="MySecretSanta"
      />
      <main className="relative z-10">
        {/* Hero section */}
        <motion.section
          aria-label="Hero"
          className="mb-16 pt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <div className="max-w-3xl px-4">
              <motion.h1
                className="mb-6 text-5xl font-bold tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.span
                    className="inline-block text-white"
                    animate={{
                      textShadow: [
                        "0 0 8px rgba(255,255,255,0.3)",
                        "0 0 16px rgba(255,255,255,0.3)",
                        "0 0 8px rgba(255,255,255,0.3)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {t("hero.title1")}
                  </motion.span>
                </motion.span>{" "}
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.span
                    className="inline-block bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      textShadow: [
                        "0 0 20px rgba(239,68,68,0.5)",
                        "0 0 30px rgba(239,68,68,0.7)",
                        "0 0 20px rgba(239,68,68,0.5)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                    style={{ backgroundSize: "200% auto" }}
                  >
                    {t("hero.title2")}
                  </motion.span>
                </motion.span>{" "}
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.span
                    className="inline-block bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      textShadow: [
                        "0 0 20px rgba(239,68,68,0.5)",
                        "0 0 30px rgba(239,68,68,0.7)",
                        "0 0 20px rgba(239,68,68,0.5)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                    style={{ backgroundSize: "200% auto" }}
                  >
                    {t("hero.title3")}
                  </motion.span>
                </motion.span>
                <br />
                <motion.div
                  className="mt-2 inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <motion.span
                    className="relative inline-block italic"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(239,68,68,0.5)",
                        "0 0 30px rgba(239,68,68,0.7)",
                        "0 0 20px rgba(239,68,68,0.5)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <motion.span
                      className="bg-gradient-to-r from-purple-500 via-fuchsia-400 to-violet-600 bg-clip-text px-[2px] text-transparent"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ backgroundSize: "200% auto" }}
                    >
                      {t("hero.subtitle1")}
                    </motion.span>
                  </motion.span>
                </motion.div>{" "}
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <motion.span
                    className="inline-block text-white"
                    animate={{
                      textShadow: [
                        "0 0 8px rgba(255,255,255,0.3)",
                        "0 0 16px rgba(255,255,255,0.3)",
                        "0 0 8px rgba(255,255,255,0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {t("hero.subtitle2")}
                  </motion.span>
                </motion.span>
              </motion.h1>

              <motion.p
                className="mb-8 text-xl text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                {t("hero.description")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                  animate={{
                    rotate: [0, -1, 1, -1, 1, 0],
                    transition: {
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 5,
                    },
                  }}
                >
                  <button
                    onClick={() => createGameRoom.mutate()}
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-red-500 to-red-700 px-8 py-4 text-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-red-500/50"
                    aria-label="Start creating your Secret Santa gift exchange"
                  >
                    <motion.span
                      className="relative z-10 flex items-center gap-2"
                      whileHover={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      {t("hero.button")}
                      <span aria-hidden="true">→</span>
                    </motion.span>
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="mx-auto mb-16 max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-4 rounded-2xl bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400">{t("stats.free")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1 Min</div>
                <div className="text-sm text-gray-400">{t("stats.setup")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">AI</div>
                <div className="text-sm text-gray-400">{t("stats.ideas")}</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* How it Works section */}
        <motion.section
          aria-label="How it Works"
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="mb-8 text-center text-3xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5 }}
          >
            {t("howItWorks.title")}
          </motion.h2>
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                  }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(239,68,68,0.1)",
                    transition: {
                      duration: 0.2,
                      ease: "easeOut",
                    },
                  }}
                  className="group relative rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                >
                  <motion.div className="mb-4 text-4xl transition-all duration-300 group-hover:scale-110 group-hover:text-red-500">
                    {item.icon}
                  </motion.div>
                  <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-sm font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-red-500/50">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white transition-all duration-300 group-hover:text-red-400">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-gray-400 transition-all duration-300 group-hover:text-red-200">
                    {t(item.descriptionKey)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features section */}
        <motion.section
          aria-label="Features"
          className="mx-auto max-w-7xl px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="mb-8 text-center text-3xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5 }}
          >
            {t("features.title")}
          </motion.h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.article
                key={feature.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2,
                }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(34,197,94,0.1)",
                  transition: {
                    duration: 0.2,
                    ease: "easeOut",
                  },
                }}
                className="group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
              >
                <motion.div
                  className="mb-4 text-4xl transition-all duration-300 group-hover:scale-110 group-hover:text-green-500"
                  role="img"
                  aria-label={t(feature.titleKey)}
                >
                  {feature.emoji}
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold text-white transition-all duration-300 group-hover:text-green-400">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-gray-400 transition-all duration-300 group-hover:text-green-200">
                  {t(feature.descriptionKey)}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* CTA section */}
        <motion.section
          aria-label="Call to Action"
          className="my-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl px-4"
          >
            <h2 className="mb-4 text-3xl font-bold text-white">
              {t("cta.title")}
            </h2>
            <p className="mb-8 text-gray-300">{t("cta.description")}</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
              animate={{
                rotate: [0, -1, 1, -1, 1, 0],
                transition: {
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 5,
                },
              }}
            >
              <button
                onClick={() => createGameRoom.mutate()}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-green-500 to-green-700 px-8 py-4 text-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-green-500/50"
                aria-label="Create your Secret Santa exchange now"
              >
                {t("cta.button")}
              </button>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Social Share Section */}
        <section aria-label="Share" className="mt-16">
          <SocialShareButtons />
        </section>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "home"])),
    },
  };
};

export default LandingPage;

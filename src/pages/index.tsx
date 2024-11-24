import { motion } from "framer-motion";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { SocialShareButtons } from "~/components/SocialShareButtons";
import { api } from "~/utils/api";

const features = [
  {
    emoji: "🎁",
    title: "Easy Setup",
    description:
      "Create your Secret Santa group in seconds. No account needed!",
  },
  {
    emoji: "🎯",
    title: "Smart Matching",
    description:
      "Our algorithm ensures fair and random gift assignments for everyone.",
  },
  {
    emoji: "✨",
    title: "Gift Ideas",
    description:
      "Get AI-powered gift suggestions based on interests and budget.",
  },
  {
    emoji: "🔒",
    title: "Private & Secure",
    description:
      "Assignments are kept secret and shared through private links.",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Create Exchange",
    description: "Start your Secret Santa group with one click",
    icon: "🎯",
  },
  {
    step: 2,
    title: "Add Members",
    description: "Invite your friends, family, or colleagues",
    icon: "👥",
  },
  {
    step: 3,
    title: "Get Matched",
    description: "We'll randomly assign gift exchanges",
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

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const LandingPage: NextPage = (props) => {
  const router = useRouter();
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
      <Head>
        <title>
          MySecretSanta - Free Secret Santa Gift Exchange Organizer | Easy & Fun
        </title>
        <meta
          name="description"
          content="Create and organize your Secret Santa gift exchange easily and for free! Perfect for family, friends, or office parties. Automatic matching, wish lists, and private links for all participants."
        />
        <meta
          name="keywords"
          content="Secret Santa, gift exchange, Christmas gift organizer, Secret Santa generator, gift exchange app, Secret Santa online, free Secret Santa organizer"
        />
        <meta
          property="og:title"
          content="MySecretSanta - Free Secret Santa Gift Exchange Organizer"
        />
        <meta
          property="og:description"
          content="Create and organize your Secret Santa gift exchange easily and for free! Perfect for family, friends, or office parties."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="MySecretSanta - Free Secret Santa Gift Exchange Organizer"
        />
        <meta
          name="twitter:description"
          content="Create and organize your Secret Santa gift exchange easily and for free!"
        />
        <link rel="canonical" href="https://mysecretsantas.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* Main content */}
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
                    Make
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
                    Secret
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
                    Santa
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
                      Magical
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
                    This Year
                  </motion.span>
                </motion.span>
              </motion.h1>

              <motion.p
                className="mb-8 text-xl text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                The easiest way to organize your Secret Santa gift exchange. No
                accounts, no hassle - just holiday joy!
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
                      Start Now
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
                <div className="text-sm text-gray-400">Free Forever</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1 Min</div>
                <div className="text-sm text-gray-400">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">AI</div>
                <div className="text-sm text-gray-400">Gift Ideas</div>
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
            How It Works
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
                    {item.title}
                  </h3>
                  <p className="text-gray-400 transition-all duration-300 group-hover:text-red-200">
                    {item.description}
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
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.article
                key={index}
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
                  aria-label={feature.title}
                >
                  {feature.emoji}
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold text-white transition-all duration-300 group-hover:text-green-400">
                  {feature.title}
                </h3>
                <p className="text-gray-400 transition-all duration-300 group-hover:text-green-200">
                  {feature.description}
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
              Ready to Start Your Secret Santa?
            </h2>
            <p className="mb-8 text-gray-300">
              Join thousands of happy gift-givers and make this holiday season
              unforgettable!
            </p>
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
                Create Exchange
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

export default LandingPage;

import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import type { AssignmentWithRelations } from "~/server/router/types";
import { useCallback, useState } from "react";
import { Confetti } from "./Confetti";

interface AssignmentContentProps {
  assignment: AssignmentWithRelations;
  isVerified: boolean;
  isRevealed: boolean;
  pin: string;
  error: string | null;
  showPin: boolean;
  isLoading: boolean;
  handlePinSubmit: (e: React.FormEvent) => void;
  handleReveal: () => void;
  setPin: (value: string) => void;
  togglePinVisibility: () => void;
}

const giftVariants = {
  initial: {
    scale: 1,
    rotate: 0,
  },
  shake: {
    rotate: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
    scale: [1, 1.1, 1.1, 1.1, 1.1, 1.15, 1.15, 1.2, 1.2, 1.2],
    transition: {
      duration: 2,
      ease: "easeInOut",
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const revealVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
};

export function AssignmentContent({
  assignment,
  isVerified,
  isRevealed,
  pin,
  error,
  showPin,
  isLoading,
  handlePinSubmit,
  handleReveal,
  setPin,
  togglePinVisibility,
}: AssignmentContentProps) {
  const { t } = useTranslation("game");
  const [isShaking, setIsShaking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleGiftClick = async () => {
    if (isShaking) return;
    setIsShaking(true);

    // Start shaking animation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Show confetti and trigger reveal
    setShowConfetti(true);
    handleReveal();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md rounded-lg bg-white/5 p-6 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
        <p className="text-gray-400">
          {t("assignment.loading.title", "Loading...")}
        </p>
        <p className="mt-2 text-gray-400">
          {t(
            "assignment.loading.description",
            "Please wait while we load your assignment.",
          )}
        </p>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-4 text-4xl"
            >
              🎁
            </motion.div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              {t("assignment.pin.title", {
                name: assignment.gifter.name,
                defaultValue: `Welcome ${assignment.gifter.name}!`,
              })}
            </h1>
            <p className="text-gray-400">
              {assignment.gifter.hasAccessed
                ? t(
                    "assignment.pin.enter_description",
                    "Please enter your PIN to view your assignment.",
                  )
                : t(
                    "assignment.pin.create_description",
                    "Create a PIN to protect your assignment.",
                  )}
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div>
              <label htmlFor="pin" className="sr-only">
                PIN
              </label>
              <div className="relative">
                <input
                  id="pin"
                  name="pin"
                  type={showPin ? "text" : "password"}
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={t(
                    "assignment.pin.input_placeholder",
                    "Enter your PIN",
                  )}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePinVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPin
                    ? t("assignment.pin.hide", "Hide")
                    : t("assignment.pin.show", "Show")}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full transform rounded-lg bg-green-500 px-4 py-3 font-medium text-white transition-colors hover:scale-105 hover:bg-green-600 active:scale-95"
            >
              {assignment.gifter.hasAccessed
                ? t("assignment.pin.submit_unlock", "Unlock Assignment")
                : t("assignment.pin.submit_create", "Create PIN")}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <Head>
        <title>Your Gift Assignment | MySecretSanta</title>
      </Head>

      {showConfetti && <Confetti isActive={true} />}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-4 text-4xl"
            >
              🎁
            </motion.div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              {t("assignment.reveal.title", {
                name: assignment.gifter.name,
                defaultValue: `Ready ${assignment.gifter.name}?`,
              })}
            </h1>
            <p className="text-gray-400">
              {!isRevealed
                ? t(
                    "assignment.reveal.pre_reveal_description",
                    "Click the button below to reveal your Secret Santa assignment!",
                  )
                : t(
                    "assignment.reveal.post_reveal_description",
                    "Here's who you'll be gifting to this year!",
                  )}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="gift"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative text-center"
              >
                <motion.div
                  className="relative z-10 inline-block cursor-pointer"
                  variants={giftVariants}
                  initial="initial"
                  animate={isShaking ? "shake" : "initial"}
                  exit="exit"
                  onClick={handleGiftClick}
                >
                  <span className="block text-9xl">🎁</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 text-lg text-gray-300"
                >
                  {t(
                    "assignment.click_to_reveal",
                    "Click the gift to reveal your assignment!",
                  )}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="assignment-details"
                variants={revealVariants}
                initial="initial"
                animate="animate"
                className="space-y-6"
              >
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="mb-2 text-gray-400">
                    {t(
                      "assignment.reveal.receiver_intro",
                      "You will be gifting to:",
                    )}
                  </p>
                  <h2 className="text-2xl font-bold text-green-400">
                    {assignment.receiver.name} 🎄
                  </h2>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    {t(
                      "assignment.reveal.magic_words_title",
                      "Their Magic Words",
                    )}
                  </h3>
                  <div className="grid gap-3">
                    {[
                      assignment.adjective1,
                      assignment.adjective2,
                      assignment.adjective3,
                    ].map((adj, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-lg border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">
                            {index === 0 ? "🎯" : index === 1 ? "💝" : "✨"}
                          </span>
                          <span className="text-white">{adj.word}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {assignment.giftIdeaImages &&
                  assignment.giftIdeaImages.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        {t("assignment.reveal.ai_ideas_title", "AI Gift Ideas")}
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {(assignment.giftIdeaImages || []).map(
                          (imageUrl: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.2 }}
                              className="relative aspect-square overflow-hidden rounded-lg border border-white/10"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imageUrl}
                                alt={`Gift idea ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </motion.div>
                          ),
                        )}
                      </div>
                      <p className="mt-2 text-center text-sm text-gray-400">
                        {t(
                          "assignment.reveal.ai_ideas_description",
                          "These gift ideas were generated by AI based on the magic words.",
                        )}
                      </p>
                    </div>
                  )}

                <div className="pt-6 text-center">
                  <p className="text-sm text-gray-400">
                    {t(
                      "assignment.reveal.footer",
                      "Remember to keep it a secret! 🤫",
                    )}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

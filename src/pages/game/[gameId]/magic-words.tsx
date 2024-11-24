import { PlusIcon, SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FloatingGameLink } from "~/components/FloatingGameLink";
import { GameLayout } from "~/components/GameLayout";
import { useMagicWords } from "~/hooks/useMagicWords";
import { ConfirmationModal } from "../../../components/ConfirmationModal";

// Emoji and color mappings for categories
const categoryStyles: Record<
  string,
  {
    emoji: string;
    bgColor: string;
    textColor: string;
    hoverBg: string;
    selectedBg: string;
    borderColor: string;
  }
> = {
  color: {
    emoji: "🎨",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-400",
    hoverBg: "hover:bg-blue-500/30",
    selectedBg: "bg-blue-500",
    borderColor: "border-blue-400/20",
  },
  texture: {
    emoji: "🧸",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-400",
    hoverBg: "hover:bg-purple-500/30",
    selectedBg: "bg-purple-500",
    borderColor: "border-purple-400/20",
  },
  style: {
    emoji: "🎭",
    bgColor: "bg-pink-500/20",
    textColor: "text-pink-400",
    hoverBg: "hover:bg-pink-500/30",
    selectedBg: "bg-pink-500",
    borderColor: "border-pink-400/20",
  },
  mood: {
    emoji: "🌟",
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-400",
    hoverBg: "hover:bg-yellow-500/30",
    selectedBg: "bg-yellow-500",
    borderColor: "border-yellow-400/20",
  },
  utility: {
    emoji: "🛠️",
    bgColor: "bg-orange-500/20",
    textColor: "text-orange-400",
    hoverBg: "hover:bg-orange-500/30",
    selectedBg: "bg-orange-500",
    borderColor: "border-orange-400/20",
  },
  interest: {
    emoji: "🎯",
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
    hoverBg: "hover:bg-green-500/30",
    selectedBg: "bg-green-500",
    borderColor: "border-green-400/20",
  },
};

const MagicWords: NextPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <GameLayout>
      <MagicWordsContent />
    </GameLayout>
  );
};

const MagicWordsContent = () => {
  const { t } = useTranslation("game");
  const router = useRouter();
  const { gameId } = router.query;

  const {
    magicWords,
    isLoadingMagicWords,
    categories,
    isLoadingCategories,
    word: newWord,
    setWord: setNewWord,
    selectedCategoryId,
    setSelectedCategoryId,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    magicWordToDelete,
    setMagicWordToDelete,
    isClearAllModalOpen,
    setIsClearAllModalOpen,
    isGenerating,
    handleSubmit,
    handleDelete,
    handleClearAll,
    handleGenerateWithAI,
    confirmDelete,
    isAddingWord,
  } = useMagicWords();

  if (isLoadingCategories || isLoadingMagicWords) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white/10 p-8 text-center backdrop-blur-sm"
        >
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          <p className="text-gray-400">{t("magic_words.loading")}</p>
        </motion.div>
      </div>
    );
  }

  if (!categories) {
    return null;
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <div className="mb-3 flex items-center justify-center space-x-2">
          <h1 className="text-4xl">✨</h1>
          <h1 className="bg-gradient-to-r from-red-400 via-purple-400 to-red-400 bg-clip-text font-cinzel text-4xl text-transparent">
            {t("magic_words.title")}
          </h1>
          <h1 className="text-4xl">✨</h1>
        </div>
        <p className="text-gray-400">{t("magic_words.subtitle")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
      >
        <div className="space-y-6">
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-start space-x-2">
              <h2 className="bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text font-cinzel text-2xl text-transparent">
                {t("magic_words.add_section.title")}
              </h2>
              <h2 className="text-2xl">✨</h2>
            </div>
            <p className="text-sm text-gray-400">
              {t("magic_words.add_section.description")}
            </p>
          </div>

          <div className="flex flex-wrap justify-start gap-2">
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={clsx(
                  "flex items-center space-x-2 rounded-lg border px-4 py-2 transition-all",
                  selectedCategoryId === category.id
                    ? `${categoryStyles[category.name]?.selectedBg} text-white ${categoryStyles[category.name]?.borderColor}`
                    : `${categoryStyles[category.name]?.bgColor} ${categoryStyles[category.name]?.textColor} ${categoryStyles[category.name]?.hoverBg} ${categoryStyles[category.name]?.borderColor}`,
                )}
              >
                <span>
                  {t(`magic_words.categories.${category.name}.emoji`)}
                </span>
                <span>{t(`magic_words.categories.${category.name}.name`)}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder={t("magic_words.add_section.input_placeholder")}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 sm:text-base"
            />
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  void handleSubmit(
                    e as unknown as React.FormEvent<HTMLFormElement>,
                  );
                }}
                disabled={
                  !newWord.trim() || !selectedCategoryId || isAddingWord
                }
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/20 to-red-500/20 px-4 py-2.5 text-sm text-white/90 transition-all hover:from-purple-500/30 hover:to-red-500/30 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              >
                <PlusIcon className="h-5 w-5" />
                <span>{t("magic_words.add_section.add_button")}</span>
              </button>
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/20 to-red-500/20 px-4 py-2.5 text-sm text-white/90 transition-all hover:from-purple-500/30 hover:to-red-500/30 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>{t("magic_words.add_section.generate_button")}</span>
              </button>
            </div>
          </div>

          {!selectedCategoryId && (
            <p className="mt-2 text-sm text-yellow-400">
              {t("magic_words.add_section.select_category")}
            </p>
          )}

          {magicWords && magicWords.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setMagicWordToDelete(null);
                setIsClearAllModalOpen(true);
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300 sm:w-auto"
            >
              <XMarkIcon className="h-5 w-5" />
              <span>{t("magic_words.add_section.clear_all")}</span>
            </button>
          )}
        </div>
      </motion.div>

      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        {typeof gameId === "string" && (
          <Link
            href={`/game/${gameId}/participants`}
            className="flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 px-6 py-2 text-white/80 transition-colors hover:bg-white/10"
          >
            <span className="text-xl">←</span>
            <span>{t("magic_words.navigation.previous")}</span>
          </Link>
        )}
        <Link
          href={`/game/${gameId as string}/game-results`}
          className={clsx(
            "group w-full bg-gradient-to-r from-purple-500/20 to-red-500/20 px-6 py-2 text-white/90 sm:w-auto",
            "flex items-center justify-center rounded-lg transition-all hover:from-purple-500/30 hover:to-red-500/30",
            "gap-2 border border-purple-500/20",
            (!magicWords || magicWords.length < 6) &&
              "pointer-events-none cursor-not-allowed opacity-50",
          )}
        >
          <span>{t("magic_words.navigation.next")}</span>
          <span className="text-xl">→</span>
        </Link>
      </div>

      <div className="space-y-4">
        {!magicWords || magicWords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center text-gray-400"
          >
            <p>{t("magic_words.no_magic_words")}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {magicWords.map((magicWord: any, index: number) => (
              <motion.div
                key={magicWord.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-white/8 group rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
                        categoryStyles[magicWord.category.name]?.bgColor,
                        categoryStyles[magicWord.category.name]?.borderColor,
                        "group-hover:" +
                          categoryStyles[magicWord.category.name]?.hoverBg,
                      )}
                    >
                      <span className="text-sm">
                        {t(
                          `magic_words.categories.${magicWord.category.name}.emoji`,
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={clsx(
                          "transition-colors",
                          categoryStyles[magicWord.category.name]?.textColor,
                          "group-hover:" +
                            categoryStyles[
                              magicWord.category.name
                            ]?.textColor.replace("text", "text"),
                        )}
                      >
                        {magicWord.word}
                      </span>
                      <span className="text-xs text-gray-400 group-hover:text-gray-300">
                        {t(
                          `magic_words.categories.${magicWord.category.name}.name`,
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(magicWord)}
                    className="p-2 font-cinzel text-red-400 transition-colors hover:text-red-300"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {gameId && (
        <FloatingGameLink gameId={gameId as string} currentPage="magic-words" />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t("magic_words.delete_modal.title")}
        message={t("magic_words.delete_modal.message", {
          word: magicWordToDelete?.word,
        })}
        confirmText={t("magic_words.delete_modal.confirm")}
        cancelText={t("magic_words.delete_modal.cancel")}
      />

      <ConfirmationModal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        onConfirm={handleClearAll}
        title={t("magic_words.clear_all_modal.title")}
        message={t("magic_words.clear_all_modal.message")}
        confirmText={t("magic_words.clear_all_modal.confirm")}
        cancelText={t("magic_words.clear_all_modal.cancel")}
      />
    </div>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "game"])),
    },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [], // indicates that no page needs be created at build time
    fallback: "blocking", // indicates the type of fallback
  };
};

export default MagicWords;

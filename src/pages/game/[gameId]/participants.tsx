import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { motion } from "framer-motion";
import { type NextPage, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FloatingGameLink } from "~/components/FloatingGameLink";
import { GameLayout } from "~/components/GameLayout";
import { useParticipants } from "~/hooks/useParticipants";
import { api } from "~/utils/api";
import { ConfirmationModal } from "../../../components/ConfirmationModal";

const ParticipantsPage: NextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  return (
    <GameLayout>
      <ParticipantsContent />
    </GameLayout>
  );
};

const ParticipantsContent = () => {
  const { t } = useTranslation("game");
  const {
    newParticipant,
    setNewParticipant,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    participantToDelete,
    participants,
    isLoadingParticipants,
    gameId,
    handleSubmit,
    handleDelete,
    confirmDelete,
    handleNext,
    isClearAllModalOpen,
    setIsClearAllModalOpen,
    handleClearAll,
    isAddingParticipant,
  } = useParticipants();

  const router = useRouter();
  const { data: gameRoom } = api.gameRoom.getByCode.useQuery(
    { code: gameId as string },
    { enabled: !!gameId },
  );

  return (
    <>
      <Head>
        <title>{t("participants.meta.title")} - MySecretSanta</title>
        <meta
          name="description"
          content={t("participants.meta.description")}
        />
      </Head>

      <div className="space-y-8 px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center"
        >
          <div className="mb-3 flex items-center justify-center space-x-2">
            <h1 className="text-3xl sm:text-4xl">🎄</h1>
            <h1 className="bg-gradient-to-r from-red-400 via-purple-400 to-red-400 bg-clip-text font-cinzel text-3xl text-transparent sm:text-4xl">
              {t("participants.title")}
            </h1>
            <h1 className="text-3xl sm:text-4xl">🎅</h1>
          </div>
          <p className="text-sm text-gray-400 sm:text-base">
            {t("participants.subtitle")}
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-start space-x-2">
                  <h2 className="bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text font-cinzel text-xl text-transparent sm:text-2xl">
                    {t("participants.add_section.title")}
                  </h2>
                  <h2 className="text-xl sm:text-2xl">✨</h2>
                </div>
                <p className="text-xs text-gray-400 sm:text-sm">
                  {t("participants.add_section.description")}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  placeholder={t("participants.add_section.input_placeholder")}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 sm:text-base"
                />
                <button
                  type="submit"
                  disabled={!newParticipant.trim() || isAddingParticipant}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/20 to-red-500/20 px-6 py-2.5 text-sm text-white/90 transition-all hover:from-purple-500/30 hover:to-red-500/30 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-base"
                >
                  {isAddingParticipant ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/90" />
                      <span>{t("participants.add_section.adding")}</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5" />
                      <span>{t("participants.add_section.add_button")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          <div className="mb-8 flex flex-col items-center justify-end gap-4 sm:flex-row">
            <Link
              href={`/game/${gameId as string}/magic-words`}
              className={clsx(
                "w-full bg-gradient-to-r from-purple-500/20 to-red-500/20 px-6 py-2.5 text-white/90 sm:w-auto",
                "flex items-center justify-center rounded-lg transition-all hover:from-purple-500/30 hover:to-red-500/30",
                "gap-2 border border-purple-500/20",
                participants &&
                  participants.length < 2 &&
                  "pointer-events-none cursor-not-allowed opacity-50",
              )}
            >
              <span>{t("participants.next_button")}</span>
              <span className="text-xl">→</span>
            </Link>
          </div>

          <div className="space-y-4">
            {participants && participants.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center text-gray-400"
              >
                <p>
                  {t("participants.no_participants")}
                </p>
              </motion.div>
            ) : (
              <div className="grid gap-3">
                {participants &&
                  participants.map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-white/8 group rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/20 bg-gradient-to-br from-purple-500/20 to-red-500/20 transition-colors group-hover:from-purple-500/30 group-hover:to-red-500/30">
                            <span className="text-xl">🎅</span>
                          </div>
                          <span className="line-clamp-1 text-base text-purple-400 transition-colors group-hover:text-purple-300 sm:text-lg">
                            {participant.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(participant)}
                          className="p-2 text-red-400 transition-colors hover:text-red-300"
                          aria-label={`Delete ${participant.name}`}
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>

          {participants && participants.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsClearAllModalOpen(true)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300 sm:text-base"
              >
                <XMarkIcon className="h-5 w-5" />
                <span>{t("participants.clear_all_button")}</span>
              </button>
            </div>
          )}
        </div>

        {gameId && (
          <FloatingGameLink
            gameId={gameId as string}
            currentPage="participants"
          />
        )}

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title={t("participants.delete_modal.title")}
          message={t("participants.delete_modal.message", { name: participantToDelete?.name })}
          confirmText={t("participants.delete_modal.confirm")}
          cancelText={t("participants.delete_modal.cancel")}
        />

        <ConfirmationModal
          isOpen={isClearAllModalOpen}
          onClose={() => setIsClearAllModalOpen(false)}
          onConfirm={handleClearAll}
          title={t("participants.clear_all_modal.title")}
          message={t("participants.clear_all_modal.message")}
          confirmText={t("participants.clear_all_modal.confirm")}
          cancelText={t("participants.clear_all_modal.cancel")}
        />
      </div>
    </>
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

export default ParticipantsPage;

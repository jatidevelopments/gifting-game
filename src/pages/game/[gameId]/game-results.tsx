import { AssignmentStatus as PrismaAssignmentStatus } from "@prisma/client";
import { motion } from "framer-motion";
import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FloatingGameLink } from "~/components/FloatingGameLink";
import { GameLayout } from "~/components/GameLayout";
import { LoadingAnimation } from "~/components/LoadingAnimation";
import { ParticipantShareButtons } from "~/components/ParticipantShareButtons";
import { useGameResults } from "~/hooks/useGameResults";

const GameResults: NextPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { ready } = useTranslation("game");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !ready) {
    return null;
  }

  return (
    <GameLayout>
      <GameResultsContent />
    </GameLayout>
  );
};

const GameResultsContent = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { t, ready } = useTranslation("game");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    assignments,
    isLoadingAssignments,
    isPostGenerationLoading,
    generateAssignments,
    handleGenerateAssignments,
    handleRetryGeneration,
    isGeneratingAssignments,
    isGeneratingIdeas,
    isGeneratingImages,
  } = useGameResults();

  if (!isMounted || !ready) {
    return null;
  }

  if (
    isGeneratingAssignments ||
    isLoadingAssignments ||
    isPostGenerationLoading
  ) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="bg-gradient-to-r from-red-400 via-purple-400 to-red-400 bg-clip-text font-cinzel text-3xl text-transparent">
                {t("results.assignments.loading.title")}
              </h2>
              <p className="text-xl text-gray-300">
                {t("results.assignments.loading.subtitle")}
              </p>
              <p className="text-sm text-gray-400">
                {t("results.assignments.loading.description")}
              </p>
            </div>
            <LoadingAnimation />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <h2 className="text-3xl">🎁</h2>
                <h2 className="bg-gradient-to-r from-red-400 via-purple-400 to-red-400 bg-clip-text font-cinzel text-3xl text-transparent">
                  {t("results.generate.title")}
                </h2>
                <h2 className="text-3xl">🪄</h2>
              </div>
              <p className="text-gray-400">
                {t("results.generate.description")}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() =>
                  handleGenerateAssignments(async (params) => {
                    await generateAssignments.mutateAsync(params);
                  })
                }
                disabled={
                  isGeneratingAssignments ||
                  isLoadingAssignments ||
                  isPostGenerationLoading
                }
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-200 group-hover:from-purple-500 group-hover:to-pink-500 dark:text-white dark:focus:ring-purple-800"
              >
                <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                  {t("results.generate.button")}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 text-center"
      >
        <div className="mx-auto max-w-4xl px-4 py-3">
          <h1 className="text-center font-cinzel text-3xl">
            <span>🎁</span>
            <span className="mx-2 bg-gradient-to-r from-[#6B46C1] to-[#9F7AEA] bg-clip-text text-transparent">
              {t("results.assignments.title")}
            </span>
            <span>🎁</span>
          </h1>
        </div>
        <p className="text-gray-400">{t("results.assignments.subtitle")}</p>
      </motion.div>

      <div className="mb-3 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
        <Link
          href={`/game/${gameId}/magic-words`}
          className="flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 px-6 py-2 text-white/80 transition-colors hover:bg-white/10"
        >
          <span className="text-xl">←</span>
          <span>{t("results.previous_step")}</span>
        </Link>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            onClick={handleRetryGeneration}
            disabled={
              isGeneratingAssignments ||
              isLoadingAssignments ||
              isPostGenerationLoading ||
              isGeneratingIdeas ||
              isGeneratingImages
            }
            className="group flex min-w-[180px] items-center justify-center gap-2 rounded-lg border border-yellow-500/20 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-6 py-2 text-white/90 transition-all hover:from-yellow-500/30 hover:to-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGeneratingAssignments ||
            isLoadingAssignments ||
            isPostGenerationLoading ||
            isGeneratingIdeas ||
            isGeneratingImages ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>{t("results.processing")}</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{t("results.regenerate_ideas")}</span>
              </>
            )}
          </button>
          <button
            onClick={() =>
              handleGenerateAssignments(async (params) => {
                await generateAssignments.mutateAsync(params);
              })
            }
            disabled={
              isGeneratingAssignments ||
              isLoadingAssignments ||
              isPostGenerationLoading ||
              isGeneratingIdeas ||
              isGeneratingImages
            }
            className="group flex min-w-[180px] items-center justify-center gap-2 rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/20 to-red-500/20 px-6 py-2 text-white/90 transition-all hover:from-purple-500/30 hover:to-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGeneratingAssignments ||
            isLoadingAssignments ||
            isPostGenerationLoading ||
            isGeneratingIdeas ||
            isGeneratingImages ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>{t("results.processing")}</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{t("results.regenerate_assignments")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment: any, index: number) => (
          <motion.div
            key={assignment.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.1 }}
            className={`hover:bg-white/8 group relative overflow-hidden rounded-xl border bg-white/5 p-6 backdrop-blur-sm transition-colors ${
              assignment.status === "PENDING_GIFT_IDEAS"
                ? "border-yellow-500/20"
                : "border-white/10"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-500/20 bg-gradient-to-br from-purple-500/20 to-red-500/20 transition-colors group-hover:from-purple-500/30 group-hover:to-red-500/30">
                  <span className="text-xl">🎅</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <span className="line-clamp-1 text-base text-purple-400 transition-colors group-hover:text-purple-300 sm:text-lg">
                      {assignment.gifter.name}
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {t("results.assignments.is_gifting_to")}
                      </span>
                      <span className="line-clamp-1 text-base text-purple-400 transition-colors group-hover:text-purple-300 sm:text-lg">
                        {assignment.receiver.name}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`inline-flex h-7 items-center self-start rounded-full border px-3 ${
                      assignment.status === "COMPLETED"
                        ? "border-green-500/20 bg-green-500/5 text-green-400"
                        : assignment.status === "PENDING_GIFT_IDEAS"
                          ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-400"
                          : "border-purple-500/20 bg-purple-500/5 text-purple-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          assignment.status === "COMPLETED"
                            ? "bg-green-400"
                            : assignment.status === "PENDING_GIFT_IDEAS"
                              ? "bg-yellow-400"
                              : "bg-purple-400"
                        }`}
                      />
                      <span className="text-xs font-medium">
                        {assignment.status === "COMPLETED"
                          ? t("results.assignments.ready_to_share")
                          : assignment.status === "PENDING_GIFT_IDEAS"
                            ? t("results.assignments.pending_gift_ideas")
                            : t("results.assignments.in_progress")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-end gap-3 sm:w-auto">
                <div className="w-full sm:min-w-[200px]">
                  <ParticipantShareButtons
                    participantName={assignment.gifter.name}
                    gameId={gameId}
                    assignmentId={assignment.accessUrl}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {gameId && (
          <FloatingGameLink gameId={gameId} currentPage="participants" />
        )}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["game"])),
    },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default GameResults;

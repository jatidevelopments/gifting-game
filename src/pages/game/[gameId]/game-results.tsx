import { AssignmentStatus as PrismaAssignmentStatus } from "@prisma/client";
import { motion } from "framer-motion";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { FloatingGameLink } from "~/components/FloatingGameLink";
import { GameLayout } from "~/components/GameLayout";
import { LoadingAnimation } from "~/components/LoadingAnimation";
import { ParticipantShareButtons } from "~/components/ParticipantShareButtons";
import { useGameResults } from "~/hooks/useGameResults";

const GameResults: NextPage = (props) => {
  return (
    <GameLayout>
      <GameResultsContent />
    </GameLayout>
  );
};

const GameResultsContent = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

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

  const handleCopyLink = useCallback(
    async (accessUrl: string, gifterName: string) => {
      try {
        const baseUrl = `${window.location.origin}/assignment/${accessUrl}`;
        const message = `🎄 Hey ${gifterName}! Your Secret Santa assignment is ready!\n\nClick here to see who you're gifting to: ${baseUrl}`;

        await navigator.clipboard.writeText(message);

        toast.success(`Link copied for ${gifterName}! 🎁`, {
          style: {
            background: "#1a1f35",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          duration: 6000,
        });
      } catch (error) {
        toast.error("Failed to copy link. Please try again.", {
          style: {
            background: "#1a1f35",
            color: "#ff4e4e",
            border: "1px solid rgba(255,78,78,0.2)",
          },
        });
      }
    },
    [],
  );

  const AssignmentStatus: React.FC<{ status: PrismaAssignmentStatus }> = ({
    status,
  }) => {
    let icon = "";
    let message = "";
    let color = "";

    switch (status) {
      case "PENDING_GIFT_IDEAS":
        icon = "🎨";
        message = "Generating gift ideas...";
        color = "text-yellow-500/90";
        break;
      case "PENDING_IMAGES":
        icon = "✨";
        message = "Creating gift visuals...";
        color = "text-purple-400/90";
        break;
      case "COMPLETED":
        icon = "🎁";
        message = "Ready to share!";
        color = "text-green-400/90";
        break;
      default:
        icon = "⏳";
        message = "Processing...";
        color = "text-gray-400/90";
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-2 flex items-center gap-2 ${color}`}
      >
        <div className="relative">
          <span className="text-lg">{icon}</span>
          {(status === "PENDING_GIFT_IDEAS" || status === "PENDING_IMAGES") && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{message}</span>
        </div>
      </motion.div>
    );
  };

  if (
    isGeneratingAssignments ||
    isLoadingAssignments ||
    isPostGenerationLoading
  ) {
    return <LoadingAnimation />;
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
                  Ready to Create Magic?
                </h2>
                <h2 className="text-3xl">🪄</h2>
              </div>
              <p className="text-gray-400">
                Let&apos;s generate your magical gift exchange assignments!
              </p>
            </div>

            <div className="space-y-4 rounded-lg border border-purple-500/20 bg-purple-500/10 p-6">
              <div className="flex items-center gap-3 text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/20">
                  <span className="text-purple-400">🎲</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-purple-400">
                    Random Assignment
                  </h3>
                  <p className="text-sm text-gray-400">
                    Each participant will be randomly assigned someone to gift
                    to
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/20">
                  <span className="text-purple-400">🔒</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-purple-400">Private Links</h3>
                  <p className="text-sm text-gray-400">
                    Each person gets a unique link to view their assignment
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/20">
                  <span className="text-purple-400">✨</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-purple-400">Magic Words</h3>
                  <p className="text-sm text-gray-400">
                    Their magic words will help guide the gift selection
                  </p>
                </div>
              </div>
            </div>

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
              className="group relative mx-auto flex transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-red-500 px-8 py-3 font-cinzel text-lg font-bold text-white shadow-lg shadow-purple-500/25 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-purple-500/25"
            >
              {isGeneratingAssignments ||
              isLoadingAssignments ||
              isPostGenerationLoading ? (
                <>
                  <div className="border-3 h-5 w-5 animate-spin rounded-full border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Generate Assignments</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transform transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
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
              Secret Santa Assignments
            </span>
            <span>🎁</span>
          </h1>
        </div>
        <p className="text-gray-400">
          Share these magical links with your participants to reveal their
          assignments!
        </p>
      </motion.div>

      <div className="mb-3 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
        <Link
          href={`/game/${gameId}/magic-words`}
          className="flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 px-6 py-2 text-white/80 transition-colors hover:bg-white/10"
        >
          <span className="text-xl">←</span>
          <span>Previous Step</span>
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
                <span>Processing...</span>
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
                <span>Regenerate Ideas</span>
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
                <span>Processing...</span>
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
                <span>Regenerate Assignments</span>
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
                        is gifting to
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
                          ? "Ready to Share"
                          : assignment.status === "PENDING_GIFT_IDEAS"
                            ? "Pending Gift Ideas"
                            : "In Progress"}
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

export default GameResults;

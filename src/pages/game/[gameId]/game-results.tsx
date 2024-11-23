import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { GameLayout } from '~/components/GameLayout';
import { LoadingAnimation } from '~/components/LoadingAnimation';
import { useGameResults } from '~/hooks/useGameResults';
import { CopyLinkButton } from '../../../components/CopyLinkButton';
import { AssignmentStatus as PrismaAssignmentStatus } from '@prisma/client';

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

  const handleCopyLink = useCallback(async (accessUrl: string, gifterName: string) => {
    try {
      const baseUrl = `${window.location.origin}/assignment/${accessUrl}`;
      const message = `🎄 Hey ${gifterName}! Your Secret Santa assignment is ready!\n\nClick here to see who you're gifting to: ${baseUrl}`;
      
      await navigator.clipboard.writeText(message);
      
      toast.success(`Link copied for ${gifterName}! 🎁`, {
        style: {
          background: '#1a1f35',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        duration: 6000,
      });
    } catch (error) {
      toast.error('Failed to copy link. Please try again.', {
        style: {
          background: '#1a1f35',
          color: '#ff4e4e',
          border: '1px solid rgba(255,78,78,0.2)',
        },
      });
    }
  }, []);

  const AssignmentStatus: React.FC<{ status: PrismaAssignmentStatus }> = ({ status }) => {
    let icon = '';
    let message = '';
    let color = '';

    switch (status) {
      case 'PENDING_GIFT_IDEAS':
        icon = '🎨';
        message = 'Generating gift ideas...';
        color = 'text-yellow-500/90';
        break;
      case 'PENDING_IMAGES':
        icon = '✨';
        message = 'Creating gift visuals...';
        color = 'text-purple-400/90';
        break;
      case 'COMPLETED':
        icon = '🎁';
        message = 'Ready to share!';
        color = 'text-green-400/90';
        break;
      default:
        icon = '⏳';
        message = 'Processing...';
        color = 'text-gray-400/90';
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 mt-2 ${color}`}
      >
        <div className="relative">
          <span className="text-lg">{icon}</span>
          {(status === 'PENDING_GIFT_IDEAS' || status === 'PENDING_IMAGES') && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
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

  if (isGeneratingAssignments || isLoadingAssignments || isPostGenerationLoading) {
    return (
      <LoadingAnimation />
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 max-w-2xl mx-auto"
        >
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <h2 className="text-3xl">🎁</h2>
                <h2 className="text-3xl font-cinzel bg-gradient-to-r from-red-400 via-purple-400 to-red-400 text-transparent bg-clip-text">
                  Ready to Create Magic?
                </h2>
                <h2 className="text-3xl">🪄</h2>
              </div>
              <p className="text-gray-400">Let&apos;s generate your magical gift exchange assignments!</p>
            </div>

            <div className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/20 space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/20">
                  <span className="text-purple-400">🎲</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-purple-400 font-medium">Random Assignment</h3>
                  <p className="text-sm text-gray-400">Each participant will be randomly assigned someone to gift to</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/20">
                  <span className="text-purple-400">🔒</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-purple-400 font-medium">Private Links</h3>
                  <p className="text-sm text-gray-400">Each person gets a unique link to view their assignment</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/20">
                  <span className="text-purple-400">✨</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-purple-400 font-medium">Magic Words</h3>
                  <p className="text-sm text-gray-400">Their magic words will help guide the gift selection</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleGenerateAssignments(async (params) => {
                await generateAssignments.mutateAsync(params);
              })}
              disabled={isGeneratingAssignments || isLoadingAssignments || isPostGenerationLoading}
              className="group relative px-8 py-3 bg-gradient-to-r from-purple-500 to-red-500 rounded-lg text-white font-cinzel font-bold text-lg
                shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 
                transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                disabled:hover:shadow-purple-500/25 flex items-center justify-center gap-2 mx-auto"
            >
              {isGeneratingAssignments || isLoadingAssignments || isPostGenerationLoading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Generate Assignments</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
        className="text-center space-y-2"
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-3xl font-cinzel text-center">
            <span>🎁</span>
            <span className="mx-2 bg-gradient-to-r from-[#6B46C1] to-[#9F7AEA] text-transparent bg-clip-text">
              Secret Santa Assignments
            </span>
            <span>🎁</span>
          </h1>
        </div>
        <p className="text-gray-400">Share these magical links with your participants to reveal their assignments!</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
        <Link
          href={`/game/${gameId}/magic-words`}
          className="px-6 py-2 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 
            transition-colors flex items-center space-x-2 border border-white/10"
        >
          <span className="text-xl">←</span>
          <span>Previous Step</span>
        </Link>
        <div className="flex gap-4">
            <button
              onClick={handleRetryGeneration}
              disabled={isGeneratingAssignments || isLoadingAssignments || isPostGenerationLoading || isGeneratingIdeas || isGeneratingImages}
              className="group px-6 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-white/90 
                rounded-lg hover:from-yellow-500/30 hover:to-orange-500/30 transition-all flex items-center 
                gap-2 border border-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingAssignments || isLoadingAssignments || isPostGenerationLoading || isGeneratingIdeas || isGeneratingImages ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Retry Gift Ideas</span>
                </>
              )}
            </button>
          <button
            onClick={() => handleGenerateAssignments(async (params) => {
              await generateAssignments.mutateAsync(params);
            })}
            disabled={isGeneratingAssignments || isLoadingAssignments || isPostGenerationLoading || isGeneratingIdeas || isGeneratingImages}
            className="group px-6 py-2 bg-gradient-to-r from-purple-500/20 to-red-500/20 text-white/90 
              rounded-lg hover:from-purple-500/30 hover:to-red-500/30 transition-all flex items-center 
              gap-2 border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingAssignments || isLoadingAssignments || isPostGenerationLoading || isGeneratingIdeas || isGeneratingImages ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Regenerate</span>
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
            className={`group bg-white/5 hover:bg-white/8 backdrop-blur-sm rounded-xl p-6 border 
              transition-colors relative overflow-hidden ${
                assignment.status === 'PENDING_GIFT_IDEAS' 
                  ? 'border-yellow-500/20' 
                  : 'border-white/10'
              }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center border 
                  transition-colors ${
                    assignment.status === 'PENDING_GIFT_IDEAS'
                      ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/20'
                      : 'from-purple-500/20 to-red-500/20 border-purple-500/20'
                  }`}
                >
                  <span className="text-xl">🎅</span>
                </div>
                <div>
                  <h3 className="text-lg font-cinzel text-white/90">{assignment.gifter.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">is gifting to</span>
                    <span className="font-medium text-white/80">{assignment.receiver.name}</span>
                  </div>
                  <AssignmentStatus status={assignment.status} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CopyLinkButton
                  onClick={() => handleCopyLink(assignment.accessUrl, assignment.gifter.name)}
                  disabled={assignment.status !== 'COMPLETED'}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GameResults;

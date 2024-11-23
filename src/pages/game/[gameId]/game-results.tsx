import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CopyLinkButton } from '../../../components/CopyLinkButton';
import { GameLayout } from '~/components/GameLayout';
import { useGameResults } from '~/hooks/useGameResults';

const GameResults: NextPage = (props) => {
  return (
    <GameLayout>
      <GameResultsContent />
    </GameLayout>
  );
};

const GameResultsContent = () => {
  const {
    assignments,
    isLoadingAssignments,
    isGenerating,
    gameId,
    handleGenerateAssignments,
  } = useGameResults();

  const handleCopyLink = async (accessUrl: string, gifterName: string) => {
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
        duration: 3000,
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
  };

  if (isLoadingAssignments) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center"
        >
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading assignments...</p>
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
              onClick={handleGenerateAssignments}
              disabled={isGenerating}
              className="group relative px-8 py-3 bg-gradient-to-r from-purple-500 to-red-500 rounded-lg text-white font-cinzel font-bold text-lg
                shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 
                transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                disabled:hover:shadow-purple-500/25 flex items-center justify-center gap-2 mx-auto"
            >

              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
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
        className="text-center space-y-4"
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-cinzel text-center mb-8">
            <span>🎁</span>
            <span className="mx-2 bg-gradient-to-r from-[#6B46C1] to-[#9F7AEA] text-transparent bg-clip-text">
              Game Results
            </span>
            <span>🎁</span>
          </h1>
        </div>
        <p className="text-gray-400">Share these magical links with your participants to reveal their assignments!</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <Link
          href={`/game/${gameId as string}/magic-words`}
          className="px-6 py-2 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 
            transition-colors flex items-center space-x-2 border border-white/10"
        >
          <span className="text-xl">←</span>
          <span>Previous Step</span>
        </Link>
        <button
          onClick={handleGenerateAssignments}
          disabled={isGenerating}
          className="group w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500/20 to-red-500/20 text-white/90 
            rounded-lg hover:from-purple-500/30 hover:to-red-500/30 transition-all flex items-center justify-center 
            gap-2 font-cinzel border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>Regenerating...</span>
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

      <div className="grid gap-4">
        {assignments.map((assignment: any, index: number) => (
          <motion.div
            key={assignment.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white/5 hover:bg-white/8 backdrop-blur-sm rounded-xl p-6 border border-white/10 
              transition-colors relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-red-500/20 
                  flex items-center justify-center border border-purple-500/20 group-hover:from-purple-500/30 
                  group-hover:to-red-500/30 transition-colors"
                >
                  <span className="text-xl">🎅</span>
                </div>
                <div>
                  <h3 className="text-xl font-cinzel text-purple-400 group-hover:text-purple-300 transition-colors">
                    {assignment.gifter.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Share their unique gift assignment link
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    void handleCopyLink(assignment.accessUrl, assignment.gifter.name);
                  }}
                  className="px-8 py-3 bg-purple-500/20 hover:bg-purple-500/30 
                    transition-colors rounded-lg text-purple-300 flex items-center justify-center gap-2 
                    border border-purple-400/20 font-cinzel"
                >
                  <span>Copy Link</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
                <Link
                  href={`/assignment/${assignment.accessUrl}`}
                  className="px-8 py-3 bg-red-500/20 hover:bg-red-500/30 
                    transition-colors rounded-lg text-red-300 flex items-center justify-center gap-2 
                    border border-red-300/20 font-cinzel"
                >
                  <span>Preview</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {gameId && typeof gameId === 'string' && (
        <CopyLinkButton gameCode={gameId} currentPage="game-results" />
      )}
    </div>
  );
};

export default GameResults;

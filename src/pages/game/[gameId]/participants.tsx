import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { type NextPage } from "next";
import Head from "next/head";
import Link from 'next/link';
import { useRouter } from "next/router";
import toast from 'react-hot-toast';
import { GameLayout } from '~/components/GameLayout';
import { useParticipants } from '~/hooks/useParticipants';
import { api } from "~/utils/api";
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { CopyLinkButton } from '~/components/CopyLinkButton';

const ParticipantsPage: NextPage = (props) => {
  return (
    <GameLayout>
      <ParticipantsContent />
    </GameLayout>
  );
};

const ParticipantsContent = () => {
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
    { code: gameId as string},
    { enabled: !!gameId }
  );

  const clearAllParticipants = api.participant.clearAllParticipants.useMutation({
    onSuccess: () => {
      toast.success('All participants cleared successfully!');
      setIsClearAllModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
      setIsClearAllModalOpen(false);
    }
  });

  return (
    <>
      <Head>
        <title>Add Participants - MySecretSanta</title>
        <meta name="description" content="Add participants to your gift exchange" />
      </Head>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-2 mb-3">
            <h1 className="text-4xl">🎄</h1>
            <h1 className="text-4xl font-cinzel bg-gradient-to-r from-red-400 via-purple-400 to-red-400 text-transparent bg-clip-text">
              Invite Your Elves
            </h1>
            <h1 className="text-4xl">🎅</h1>
          </div>
          <p className="text-gray-400">Add the magical participants who will join your gift exchange!</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-8">
          <Link
            href={`/game/${gameId as string}/magic-words`}
            className={clsx(
              "group w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-purple-500/20 to-red-500/20 text-white/90",
              "rounded-lg hover:from-purple-500/30 hover:to-red-500/30 transition-all flex items-center justify-center",
              "gap-2 border border-purple-500/20",
              participants && participants.length < 2 && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            <span>Next Step</span>
            <span className="text-xl">→</span>
          </Link>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-start space-x-2">
                  <h2 className="text-2xl font-cinzel bg-gradient-to-r from-purple-400 to-red-400 text-transparent bg-clip-text">
                    Add a Participant
                  </h2>
                  <h2 className="text-2xl">✨</h2>
                </div>
                <p className="text-sm text-gray-400">Enter the name of someone joining the gift exchange</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  placeholder="Enter participant name..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-purple-500/50 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!newParticipant.trim() || isAddingParticipant}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-red-500/20 
                    text-white/90 rounded-lg hover:from-purple-500/30 hover:to-red-500/30 
                    transition-all flex items-center justify-center gap-2 border font-cinzel
                    border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingParticipant ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white/90 rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          <div className="space-y-4">
            {participants && participants.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-400"
              >
                <p>No participants added yet. Start by adding someone above! 🎁</p>
              </motion.div>
            ) : (
              <div className="grid gap-3">
                {participants && participants.map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/5 hover:bg-white/8 backdrop-blur-sm rounded-xl p-4 
                      border border-white/10 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 
                        to-red-500/20 flex items-center justify-center border border-purple-500/20 
                        group-hover:from-purple-500/30 group-hover:to-red-500/30 transition-colors"
                      >
                        <span className="text-xl">🎅</span>
                      </div>
                      <span className="text-lg text-purple-400 
                        group-hover:text-purple-300 transition-colors"
                      >
                        {participant.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(participant)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors font-cinzel"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {participants && participants.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => setIsClearAllModalOpen(true)}
              className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 
                rounded-lg transition-colors flex items-center gap-2 font-cinzel"
            >
              <XMarkIcon className="w-5 h-5" />
              <span>Clear All</span>
            </button>
          </div>
        )}

      {gameId && (
        <CopyLinkButton gameCode={gameId as string} currentPage="magic-words" />
      )}

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Participant"
          message={`Are you sure you want to delete "${participantToDelete?.name}"?`}
          confirmText="Delete"
          cancelText="Cancel"
        />

        <ConfirmationModal
          isOpen={isClearAllModalOpen}
          onClose={() => setIsClearAllModalOpen(false)}
          onConfirm={handleClearAll}
          title="Clear All Participants"
          message="Are you sure you want to delete all participants? This action cannot be undone."
          confirmText="Clear All"
          cancelText="Cancel"
        />
      </div>
    </>
  );
};

export default ParticipantsPage;

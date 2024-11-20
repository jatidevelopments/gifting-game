import { client as api } from '../trpc/server';
import { useState } from 'react';
import type { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlusIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ConfirmationModal } from '../components/ConfirmationModal';
import Link from 'next/link';

const Participants: NextPage = (props) => {
  const { data: participants, isLoading } = api.participant.getAll.useQuery(undefined, {
    enabled: typeof window !== 'undefined',
  });
  const utils = api.useContext();
  const addParticipant = api.participant.add.useMutation({
    onSuccess: () => {
      void utils.participant.getAll.invalidate();
      toast.success('Participant added successfully!');
      setName('');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const deleteParticipant = api.participant.delete.useMutation({
    onSuccess: () => {
      void utils.participant.getAll.invalidate();
      toast.success('Participant deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const clearAllParticipants = api.participant.clearAllParticipants.useMutation({
    onSuccess: () => {
      void utils.participant.getAll.invalidate();
      toast.success('All participants cleared successfully!');
      setIsClearAllModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const [name, setName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    await addParticipant.mutate({ name: name.trim() });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 text-white"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-green-400 mb-8 font-christmas">Participants 👥</h1>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter participant name"
                  className="flex-1 px-4 py-2 rounded-lg border border-white/20 bg-white/5 focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-white/50"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors duration-200"
                  disabled={addParticipant.isPending}
                >
                  <UserPlusIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Add</span>
                </motion.button>
              </div>
            </form>

            <motion.button
              onClick={() => setIsClearAllModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-red-500/20 text-red-400 px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors duration-200 w-full sm:w-auto"
              disabled={clearAllParticipants.isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>
                {clearAllParticipants.isPending ? 'Clearing...' : 'Clear All'}
              </span>
            </motion.button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {participants?.map((participant: any) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border border-white/10 bg-white/5 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-red-400" />
                  <span className="text-white">{participant.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setParticipantToDelete({ id: participant.id, name: participant.name });
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Button */}
        <div className="mt-12 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0">
          <Link
            href="/adjectives"
            className="inline-flex items-center justify-center px-6 py-4 text-lg font-medium rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors w-full sm:w-auto"
          >
            Next: Add Adjectives
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setParticipantToDelete(null);
          }}
          onConfirm={() => {
            if (participantToDelete) {
              deleteParticipant.mutate({ id: participantToDelete.id });
            }
          }}
          title="Delete Participant"
          message={`Are you sure you want to delete ${participantToDelete?.name}? This action cannot be undone.`}
        />

        <ConfirmationModal
          isOpen={isClearAllModalOpen}
          onClose={() => setIsClearAllModalOpen(false)}
          onConfirm={() => clearAllParticipants.mutate()}
          title="Clear All Participants"
          message="Are you sure you want to delete all participants? This action cannot be undone and will also remove all game assignments."
        />
      </div>
    </motion.div>
  );
};

export default Participants;

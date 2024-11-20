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

  const handleDelete = (participant: any) => {
    setParticipantToDelete(participant);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (participantToDelete) {
      deleteParticipant.mutate({ id: participantToDelete.id });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-christmas text-red-400 mb-2">Participants</h1>
        <p className="text-gray-400">Add people to your gift exchange!</p>
      </motion.div>

      {/* Add Participant Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter participant name..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <UserPlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Add Participant</span>
          </button>
          <button
            type="button"
            onClick={() => setIsClearAllModalOpen(true)}
            className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
          >
            <XMarkIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </form>
      </motion.div>

      {/* Participants List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {participants?.map((participant) => (
            <motion.div
              key={participant.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative group"
            >
              <button
                onClick={() => handleDelete(participant)}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500/10 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="w-5 h-5 text-red-400" />
              </button>
              <div className="flex items-center space-x-3">
                <UserIcon className="w-6 h-6 text-green-400" />
                <span className="text-white font-medium">{participant.name}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Link
          href="/adjectives"
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
        >
          <span>Next: Adjectives</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Participant"
        message={`Are you sure you want to delete "${participantToDelete?.name}"?`}
      />

      <ConfirmationModal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        onConfirm={() => clearAllParticipants.mutate()}
        title="Clear All Participants"
        message="Are you sure you want to delete all participants? This action cannot be undone."
      />
    </div>
  );
};

export default Participants;

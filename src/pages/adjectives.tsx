import { client as api } from '../trpc/server';
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import { TagIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ConfirmationModal } from '../components/ConfirmationModal';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';

// Emoji mappings for categories
const categoryEmojis: Record<string, string> = {
  'Color': '🎨',
  'Texture': '🧸',
  'Style': '🎭',
  'Mood': '🌟',
  'Utility': '🛠️',
  'Interest': '🎯',
};

type CategoryWithAdjectives = Prisma.CategoryGetPayload<{
  include: { adjectives: true };
}>;

const Adjectives: NextPage = (props) => {
  const { data: adjectives, isLoading: isLoadingAdjectives, refetch: refetchAdjectives } = api.adjective.getAll.useQuery();
  const { data: categories, isLoading: isLoadingCategories, refetch: refetchCategories } = api.category.getAll.useQuery();
  const [categoryNames, setCategoryNames] = useState<Record<number, string>>({});

  useEffect(() => {
    if (categories) {
      const mappedCategories = categories.reduce<Record<number, string>>(
        (acc: Record<number, string>, category: Prisma.CategoryGetPayload<{}>) => ({
          ...acc,
          [category.id]: `${categoryEmojis[category.name] ?? ''} ${category.name}`,
        }),
        {}
      );
      setCategoryNames(mappedCategories);
    }
  }, [categories]);

  const utils = api.useContext();
  const addAdjective = api.adjective.add.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchAdjectives(),
        refetchCategories(),
        utils.adjective.getAll.invalidate(),
        utils.category.getAll.invalidate()
      ]);
      toast.success('Adjective added successfully!');
      setWord('');
      setDescription('');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const deleteAdjective = api.adjective.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchAdjectives(),
        refetchCategories(),
        utils.adjective.getAll.invalidate(),
        utils.category.getAll.invalidate()
      ]);
      toast.success('Adjective deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const generateForAllCategories = api.adjective.generateForAllCategories.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchAdjectives(),
        refetchCategories(),
        utils.adjective.getAll.invalidate(),
        utils.category.getAll.invalidate()
      ]);
      toast.success('Generated adjectives for all categories!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const clearAllAdjectives = api.adjective.clearAll.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchAdjectives(),
        refetchCategories(),
        utils.adjective.getAll.invalidate(),
        utils.category.getAll.invalidate()
      ]);
      toast.success('All adjectives cleared successfully!');
      setIsClearAllModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const [word, setWord] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adjectiveToDelete, setAdjectiveToDelete] = useState<{ id: number; word: string } | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!word.trim() || !selectedCategoryId) {
      toast.error('Please enter an adjective and select a category');
      return;
    }
    await addAdjective.mutate({ word: word.trim(), categoryId: Number(selectedCategoryId) });
  };

  const handleDelete = (adjective: any) => {
    setAdjectiveToDelete(adjective);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (adjectiveToDelete) {
      deleteAdjective.mutate({ id: adjectiveToDelete.id });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-christmas text-red-400 mb-2">Adjectives</h1>
        <p className="text-gray-400">Add descriptive words to make gift-giving more exciting!</p>
      </motion.div>

      {/* Category Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(String(category.id))}
            className={`px-4 py-2 rounded-full border transition-colors ${
              selectedCategoryId === String(category.id)
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-white/20 text-white hover:border-green-500 hover:text-green-500'
            }`}
          >
            {categoryEmojis[category.name]} {category.name}
          </button>
        ))}
      </motion.div>

      {/* Add Adjective Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter an adjective..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
          />
          <button
            type="submit"
            disabled={!word || !selectedCategoryId}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add</span>
          </button>
          <button
            type="button"
            onClick={() => generateForAllCategories.mutate()}
            disabled={generateForAllCategories.isPending}
            className="px-6 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{generateForAllCategories.isPending ? 'Generating...' : 'Generate with AI'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsClearAllModalOpen(true)}
            className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
          >
            <XMarkIcon className="w-5 h-5" />
            <span>Clear All</span>
          </button>
        </form>
      </motion.div>

      {/* Adjectives List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {adjectives?.map((adjective) => (
            <motion.div
              key={adjective.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative group"
            >
              <button
                onClick={() => handleDelete(adjective)}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500/10 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="w-5 h-5 text-red-400" />
              </button>
              <div className="flex items-center space-x-2 mb-2">
                <TagIcon className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">{adjective.word}</span>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                  {categoryNames[adjective.categoryId]}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Link
          href="/participants"
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>Back to Participants</span>
        </Link>
        <Link
          href="/game-results"
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Next: Game Results</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Adjective"
        message={`Are you sure you want to delete "${adjectiveToDelete?.word}"?`}
      />

      <ConfirmationModal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        onConfirm={() => clearAllAdjectives.mutate()}
        title="Clear All Adjectives"
        message="Are you sure you want to delete all adjectives? This action cannot be undone."
      />
    </div>
  );
};

export default Adjectives;

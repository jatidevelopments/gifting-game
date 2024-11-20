import { api } from '../trpc/server';
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
  const { data: adjectives } = api.adjective.getAll.useQuery();
  const { data: categories } = api.category.getAll.useQuery();
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
    onSuccess: () => {
      void utils.adjective.getAll.invalidate();
      toast.success('Adjective added successfully!');
      setWord('');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const deleteAdjective = api.adjective.delete.useMutation({
    onSuccess: () => {
      void utils.adjective.getAll.invalidate();
      toast.success('Adjective deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const generateForAllCategories = api.adjective.generateForAllCategories.useMutation({
    onSuccess: () => {
      void utils.adjective.getAll.invalidate();
      toast.success('Generated adjectives for all categories!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const clearAllAdjectives = api.adjective.clearAll.useMutation({
    onSuccess: () => {
      void utils.adjective.getAll.invalidate();
      toast.success('All adjectives cleared successfully!');
      setIsClearAllModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const [word, setWord] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adjectiveToDelete, setAdjectiveToDelete] = useState<{ id: number; word: string } | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!word.trim()) {
      toast.error('Please enter an adjective');
      return;
    }
    await addAdjective.mutate({ word: word.trim(), categoryId });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 text-white"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-green-400 mb-8 font-christmas">Adjectives 🏷️</h1>

        {/* Adjective Type Selection - Hidden on mobile, shown at bottom */}
        <div className="hidden sm:flex mb-8 space-x-4">
          {Object.entries(categoryNames).map(([id, name]) => (
            <button
              key={id}
              onClick={() => setCategoryId(Number(id))}
              className={`px-4 py-2 rounded-lg transition-colors ${
                categoryId === Number(id)
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-green-400/70 hover:text-green-400'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Manual Input */}
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Enter an adjective"
                  className="flex-1 px-4 py-2 rounded-lg border border-white/20 bg-white/5 focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-white/50"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors duration-200"
                  disabled={addAdjective.isPending}
                >
                  <PlusIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Add</span>
                </motion.button>
              </div>
            </form>

            {/* AI Generation */}
            <motion.button
              onClick={() => generateForAllCategories.mutate()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-purple-500/20 text-purple-400 px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-500/30 transition-colors duration-200 w-full sm:w-auto"
              disabled={generateForAllCategories.isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>
                {generateForAllCategories.isPending ? 'Generating...' : 'Generate All with AI'}
              </span>
            </motion.button>

            {/* Clear All Button */}
            <motion.button
              onClick={() => setIsClearAllModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-red-500/20 text-red-400 px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors duration-200 w-full sm:w-auto"
              disabled={clearAllAdjectives.isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>
                {clearAllAdjectives.isPending ? 'Clearing...' : 'Clear All'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <label htmlFor="category" className="block text-white/70 mb-2 text-sm">
            Select Category for New Adjective
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 focus:outline-none focus:ring-2 focus:ring-green-500 text-white appearance-none cursor-pointer"
          >
            {Object.entries(categoryNames).map(([id, name]) => (
              <option key={id} value={id} className="bg-[#1a1f35] text-white">
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Categories and their adjectives */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {categories?.map((category: any) => {
            const categoryAdjectives = category.adjectives;

            return (
              <div key={category.id} className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>{categoryEmojis[category.name] ?? ''} {category.name}</span>
                  <span className="text-white/50 text-sm">({categoryAdjectives.length})</span>
                </h2>
                <div className="space-y-2">
                  <AnimatePresence>
                    {categoryAdjectives.map((adjective: any) => (
                      <motion.div
                        key={adjective.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/10 rounded-lg p-3 flex items-center justify-between group hover:bg-white/20 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <TagIcon className="w-4 h-4 text-green-400" />
                          <span className="text-white text-sm">{adjective.word}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setAdjectiveToDelete({
                              id: adjective.id,
                              word: adjective.word,
                            });
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/participants"
            className="inline-flex items-center justify-center px-6 py-4 text-lg font-medium rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Participants
          </Link>
          <Link
            href="/game-results"
            className="inline-flex items-center justify-center px-6 py-4 text-lg font-medium rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors w-full sm:w-auto"
          >
            Next: Game Results
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setAdjectiveToDelete(null);
          }}
          onConfirm={() => {
            if (adjectiveToDelete) {
              deleteAdjective.mutate({ id: adjectiveToDelete.id });
            }
          }}
          title="Delete Adjective"
          message={`Are you sure you want to delete "${adjectiveToDelete?.word}"? This action cannot be undone.`}
        />

        <ConfirmationModal
          isOpen={isClearAllModalOpen}
          onClose={() => setIsClearAllModalOpen(false)}
          onConfirm={() => clearAllAdjectives.mutate()}
          title="Clear All Adjectives"
          message="Are you sure you want to delete all adjectives? This action cannot be undone."
        />
      </div>
    </motion.div>
  );
};

export default Adjectives;

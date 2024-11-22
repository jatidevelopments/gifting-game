import { client as api } from '../trpc/server';
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import { TagIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ConfirmationModal } from '../components/ConfirmationModal';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';

// Emoji and color mappings for categories
const categoryStyles: Record<string, { emoji: string, bgColor: string, textColor: string, hoverBg: string, selectedBg: string }> = {
  'color': {
    emoji: '🎨',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    hoverBg: 'hover:bg-blue-500/30',
    selectedBg: 'bg-blue-500'
  },
  'texture': {
    emoji: '🧸',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    hoverBg: 'hover:bg-purple-500/30',
    selectedBg: 'bg-purple-500'
  },
  'style': {
    emoji: '🎭',
    bgColor: 'bg-pink-500/20',
    textColor: 'text-pink-400',
    hoverBg: 'hover:bg-pink-500/30',
    selectedBg: 'bg-pink-500'
  },
  'mood': {
    emoji: '🌟',
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
    hoverBg: 'hover:bg-yellow-500/30',
    selectedBg: 'bg-yellow-500'
  },
  'utility': {
    emoji: '🛠️',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    hoverBg: 'hover:bg-orange-500/30',
    selectedBg: 'bg-orange-500'
  },
  'interest': {
    emoji: '🎯',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    hoverBg: 'hover:bg-green-500/30',
    selectedBg: 'bg-green-500'
  },
};

type CategoryWithMagicWords = Prisma.CategoryGetPayload<{
  include: { adjectives: true };
}>;

const MagicWords: NextPage = (props) => {
  const { data: magicWords, isLoading: isLoadingMagicWords, refetch: refetchMagicWords } = api.adjective.getAll.useQuery();
  const { data: categories, isLoading: isLoadingCategories, refetch: refetchCategories } = api.category.getAll.useQuery();
  const [categoryNames, setCategoryNames] = useState<Record<number, string>>({});

  useEffect(() => {
    if (categories) {
      const mappedCategories = categories.reduce<Record<number, string>>(
        (acc: Record<number, string>, category: Prisma.CategoryGetPayload<{}>) => ({
          ...acc,
          [category.id]: `${categoryStyles[category.name.toLowerCase()]?.emoji ?? ''} ${category.name}`,
        }),
        {}
      );
      setCategoryNames(mappedCategories);
    }
  }, [categories]);

  const utils = api.useContext();
  const addMagicWord = api.adjective.add.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchMagicWords(),
        refetchCategories(),
        utils.adjective.getAll.invalidate(),
        utils.category.getAll.invalidate()
      ]);
      toast.success('Magic word added successfully!');
      setWord('');
      setDescription('');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const deleteMagicWord = api.adjective.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchMagicWords(),
        refetchCategories(),
        utils.adjective.getAll.invalidate(),
        utils.category.getAll.invalidate()
      ]);
      toast.success('Magic word deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const generateForAllCategories = api.adjective.generateForAllCategories.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchMagicWords(),
        refetchCategories(),
        utils.adjective.getAll.invalidate(),
        utils.category.getAll.invalidate()
      ]);
      toast.success('Generated magic words for all categories!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const clearAllMagicWords = api.adjective.clearAll.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchMagicWords(),
        refetchCategories(),
        utils.adjective.getAll.invalidate(),
        utils.category.getAll.invalidate()
      ]);
      toast.success('All magic words cleared successfully!');
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
  const [magicWordToDelete, setMagicWordToDelete] = useState<{ id: number; word: string } | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!word.trim() || !selectedCategoryId) {
      toast.error('Please enter a magic word and select a category');
      return;
    }
    await addMagicWord.mutate({ word: word.trim(), categoryId: Number(selectedCategoryId) });
  };

  const handleDelete = (magicWord: any) => {
    setMagicWordToDelete(magicWord);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (magicWordToDelete) {
      deleteMagicWord.mutate({ id: magicWordToDelete.id });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-christmas text-red-400 mb-2">Magic Words</h1>
        <p className="text-gray-400">Add descriptive magic words to make gift-giving more exciting!</p>
      </motion.div>

      {/* Category Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        {categories?.map((category) => {
          console.log('Category:', category.name, 'Style:', categoryStyles[category.name.toLowerCase()]);
          const style = categoryStyles[category.name.toLowerCase()] ?? {
            emoji: '✨',
            bgColor: 'bg-white/5',
            textColor: 'text-white',
            hoverBg: 'hover:bg-white/10',
            selectedBg: 'bg-green-500'
          };
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(String(category.id))}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedCategoryId === String(category.id)
                  ? `${style.selectedBg} border-transparent text-white`
                  : `border-white/20 ${style.textColor} hover:border-transparent ${style.hoverBg}`
              }`}
            >
              {style.emoji} {category.name}
            </button>
          );
        })}
      </motion.div>

      {/* Add Magic Word Form */}
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
            placeholder="Enter a magic word..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
          />
          <button
            type="submit"
            disabled={!word || !selectedCategoryId}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="md:block">Add</span>
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
            <span className="md:block">{generateForAllCategories.isPending ? 'Generating...' : 'Generate with AI'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsClearAllModalOpen(true)}
            className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
          >
            <XMarkIcon className="w-5 h-5" />
            <span className="md:block">Clear All</span>
          </button>
        </form>
      </motion.div>

      {/* Magic Words List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {magicWords?.map((magicWord) => (
            <motion.div
              key={magicWord.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative group"
            >
              <button
                onClick={() => handleDelete(magicWord)}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500/10 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="w-5 h-5 text-red-400" />
              </button>
              <div className="flex items-center space-x-2 mb-2">
                <TagIcon className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">{magicWord.word}</span>
              </div>
              <div className="mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  categoryStyles[categories?.find(c => c.id === magicWord.categoryId)?.name.toLowerCase() ?? '']?.bgColor ?? 'bg-white/5'
                } ${
                  categoryStyles[categories?.find(c => c.id === magicWord.categoryId)?.name.toLowerCase() ?? '']?.textColor ?? 'text-white'
                }`}>
                  {categoryNames[magicWord.categoryId]}
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
        title="Delete Magic Word"
        message={`Are you sure you want to delete "${magicWordToDelete?.word}"?`}
      />

      <ConfirmationModal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        onConfirm={() => clearAllMagicWords.mutate()}
        title="Clear All Magic Words"
        message="Are you sure you want to delete all magic words? This action cannot be undone."
      />
    </div>
  );
};

export default MagicWords;

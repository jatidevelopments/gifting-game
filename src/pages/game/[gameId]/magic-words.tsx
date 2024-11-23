import type { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import { TagIcon, PlusIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import Link from 'next/link';
import { CopyLinkButton } from "~/components/CopyLinkButton";
import { GameLayout } from '~/components/GameLayout';
import { useMagicWords } from '~/hooks/useMagicWords';
import clsx from 'clsx';
import { useRouter } from 'next/router';

// Emoji and color mappings for categories
const categoryStyles: Record<string, { 
  emoji: string, 
  bgColor: string, 
  textColor: string, 
  hoverBg: string, 
  selectedBg: string,
  borderColor: string 
}> = {
  'color': {
    emoji: '🎨',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    hoverBg: 'hover:bg-blue-500/30',
    selectedBg: 'bg-blue-500',
    borderColor: 'border-blue-400/20'
  },
  'texture': {
    emoji: '🧸',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    hoverBg: 'hover:bg-purple-500/30',
    selectedBg: 'bg-purple-500',
    borderColor: 'border-purple-400/20'
  },
  'style': {
    emoji: '🎭',
    bgColor: 'bg-pink-500/20',
    textColor: 'text-pink-400',
    hoverBg: 'hover:bg-pink-500/30',
    selectedBg: 'bg-pink-500',
    borderColor: 'border-pink-400/20'
  },
  'mood': {
    emoji: '🌟',
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
    hoverBg: 'hover:bg-yellow-500/30',
    selectedBg: 'bg-yellow-500',
    borderColor: 'border-yellow-400/20'
  },
  'utility': {
    emoji: '🛠️',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    hoverBg: 'hover:bg-orange-500/30',
    selectedBg: 'bg-orange-500',
    borderColor: 'border-orange-400/20'
  },
  'interest': {
    emoji: '🎯',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    hoverBg: 'hover:bg-green-500/30',
    selectedBg: 'bg-green-500',
    borderColor: 'border-green-400/20'
  },
};

const MagicWords: NextPage = (props) => {
  return (
    <GameLayout>
      <MagicWordsContent />
    </GameLayout>
  );
};

const MagicWordsContent = () => {
  const router = useRouter();
  const { gameId } = router.query;

  const {
    magicWords,
    isLoadingMagicWords,
    categories,
    isLoadingCategories,
    word: newWord,
    setWord: setNewWord,
    selectedCategoryId,
    setSelectedCategoryId,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    magicWordToDelete,
    setMagicWordToDelete,
    isClearAllModalOpen,
    setIsClearAllModalOpen,
    isGenerating,
    handleSubmit,
    handleDelete,
    handleClearAll,
    handleGenerateWithAI,
    confirmDelete
  } = useMagicWords();

  if (isLoadingCategories || isLoadingMagicWords) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center"
        >
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading magic words...</p>
        </motion.div>
      </div>
    );
  }

  if (!categories) {
    return null;
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2 mb-3">
          <h1 className="text-4xl">✨</h1>
          <h1 className="text-4xl font-cinzel bg-gradient-to-r from-red-400 via-purple-400 to-red-400 text-transparent bg-clip-text">
            Create Your Magic Words
          </h1>
          <h1 className="text-4xl">✨</h1>
        </div>
        <p className="text-gray-400">Add enchanted words to guide the perfect gift selection!</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        {typeof gameId === 'string' && (
          <Link
            href={`/game/${gameId}/participants`}
            className="px-6 py-2 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 
              transition-colors flex items-center space-x-2 border border-white/10"
          >
            <span className="text-xl">←</span>
            <span>Previous Step</span>
          </Link>
        )}
        <Link
          href={`/game/${gameId as string}/game-results`}
          className={clsx(
            "group w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-purple-500/20 to-red-500/20 text-white/90",
            "rounded-lg hover:from-purple-500/30 hover:to-red-500/30 transition-all flex items-center justify-center",
            "gap-2 border border-purple-500/20",
            (!magicWords || magicWords.length < 6) && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          <span>Next Step</span>
          <span className="text-xl">→</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <div className="space-y-6">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-start space-x-2">
              <h2 className="text-2xl font-cinzel bg-gradient-to-r from-purple-400 to-red-400 text-transparent bg-clip-text">
                Add a Magic Word
              </h2>
              <h2 className="text-2xl">✨</h2>
            </div>
            <p className="text-sm text-gray-400">
              Enter magical words that describe the perfect gifts (e.g., cozy, creative, adventurous)
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-start">
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={clsx(
                  "px-4 py-2 rounded-lg transition-all flex items-center space-x-2 border",
                  selectedCategoryId === category.id
                    ? `${categoryStyles[category.name]?.selectedBg} text-white ${categoryStyles[category.name]?.borderColor}`
                    : `${categoryStyles[category.name]?.bgColor} ${categoryStyles[category.name]?.textColor} 
                       ${categoryStyles[category.name]?.hoverBg} ${categoryStyles[category.name]?.borderColor}`
                )}
              >
                <span>{categoryStyles[category.name]?.emoji}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Enter a magic word..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-purple-500/50 focus:border-transparent"
                />
                {isGenerating && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent 
                      rounded-full animate-spin text-purple-400">
                    </div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!newWord.trim() || isGenerating || !selectedCategoryId}
                className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-red-500/20 
                  text-white/90 rounded-lg hover:from-purple-500/30 hover:to-red-500/30 
                  transition-all flex items-center justify-center gap-2 border font-cinzel
                  border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add</span>
              </button>
            </div>

            {!selectedCategoryId && (
              <p className="text-yellow-400 text-sm mt-2">
                Select a category first to add your magic word ✨
              </p>
            )}
            
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-red-500/20 
                  text-white/90 rounded-lg hover:from-purple-500/30 hover:to-red-500/30 
                  transition-all flex items-center gap-2 border font-cinzel
                  border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SparklesIcon className="w-5 h-5" />
                <span>Generate Magic Words</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (magicWords) {
                    setMagicWordToDelete(null);
                    setIsClearAllModalOpen(true);
                  }
                }}
                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 
                  rounded-lg transition-colors flex items-center gap-2"
              >
                <XMarkIcon className="w-5 h-5" />
                <span>Clear All</span>
              </button>
            </div>
          </form>

          {magicWords && magicWords.length < 6 && (
            <p className="text-red-400 text-sm mt-4">
              At least 6 magic words are needed to create the perfect enchantment ✨
            </p>
          )}
        </div>
      </motion.div>

      <div className="space-y-4">
        {(!magicWords || magicWords.length === 0) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            <p>No magic words added yet. Start by adding some enchanted words above! 🪄</p>
          </motion.div>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {magicWords.map((magicWord, index) => (
              <motion.div
                key={magicWord.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white/5 hover:bg-white/8 backdrop-blur-sm rounded-xl p-4 
                  border border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center border transition-colors",
                      categoryStyles[magicWord.category.name]?.bgColor,
                      categoryStyles[magicWord.category.name]?.borderColor,
                      "group-hover:" + categoryStyles[magicWord.category.name]?.hoverBg
                    )}>
                      <span className="text-sm">{categoryStyles[magicWord.category.name]?.emoji}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={clsx(
                        "transition-colors",
                        categoryStyles[magicWord.category.name]?.textColor,
                        "group-hover:" + categoryStyles[magicWord.category.name]?.textColor.replace('text', 'text')
                      )}>
                        {magicWord.word}
                      </span>
                      <span className="text-xs text-gray-400 group-hover:text-gray-300">
                        {magicWord.category.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(magicWord)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors font-cinzel"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {gameId && (
        <CopyLinkButton gameCode={gameId as string} currentPage="magic-words" />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Magic Word"
        message={`Are you sure you want to delete "${magicWordToDelete?.word}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmationModal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        onConfirm={handleClearAll}
        title="Clear All Magic Words"
        message="Are you sure you want to delete all magic words? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
      />
    </div>
  );
};

export default MagicWords;

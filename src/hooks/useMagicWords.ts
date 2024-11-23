import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '~/utils/api';

export const useMagicWords = () => {
  const router = useRouter();
  const { gameId } = router.query;

  const [word, setWord] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [magicWordToDelete, setMagicWordToDelete] = useState<{ id: string; word: string } | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: participants } = api.participant.getAll.useQuery(
    { gameRoomId: gameId as string },
    { enabled: !!gameId }
  );

  const { data: magicWords, isLoading: isLoadingMagicWords, refetch: refetchMagicWords } = 
    api.adjective.getAll.useQuery(
      { gameRoomId: gameId as string },
      { enabled: !!gameId }
    );

  const { data: categories, isLoading: isLoadingCategories, refetch: refetchCategories } = api.category.getAll.useQuery(
    undefined,
    {
      staleTime: Infinity, // Categories don't change often
      retry: false,
    }
  );

  const utils = api.useContext();

  const addMagicWord = api.adjective.add.useMutation({
    onSuccess: async () => {
      if (gameId) {
        await Promise.all([
          refetchMagicWords(),
          utils.adjective.getAll.invalidate({ gameRoomId: gameId as string }),
        ]);
        toast.success('✨ Magic word added successfully!');
        setWord('');
      }
    },
    onError: (error: any) => {
      if (error.message.includes('Unique')) {
        toast.error('This word is already in use!');
      } else {
        toast.error(error.message);
      }
    }
  });

  const deleteMagicWord = api.adjective.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchMagicWords(),
        refetchCategories(),
        utils.adjective.getAll.invalidate({ gameRoomId: gameId as string }),
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
        utils.adjective.getAll.invalidate({ gameRoomId: gameId as string }),
        utils.category.getAll.invalidate()
      ]);
      toast.success('Magic words generated successfully!');
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
        utils.adjective.getAll.invalidate({ gameRoomId: gameId as string }),
        utils.category.getAll.invalidate()
      ]);
      toast.success('All magic words cleared successfully!');
      setIsClearAllModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
      setIsClearAllModalOpen(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!gameId) {
      toast.error('Invalid game ID');
      return;
    }

    const trimmedWord = word.trim();
    if (!trimmedWord) {
      toast.error('Please enter a word');
      return;
    }

    if (!selectedCategoryId) {
      toast.error('Please select a category');
      return;
    }

    addMagicWord.mutate({
      word: trimmedWord,
      categoryId: selectedCategoryId,
      gameRoomId: gameId as string
    });
  };

  const handleDelete = (magicWord: { id: string; word: string }) => {
    setMagicWordToDelete(magicWord);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (magicWordToDelete && gameId) {
      deleteMagicWord.mutate({
        id: magicWordToDelete.id,
        gameRoomId: gameId as string
      });
    }
  };

  const handleGenerateWithAI = async () => {
    if (!gameId || !participants) {
      toast.error('Unable to generate words: missing game data');
      return;
    }

    if (!categories || categories.length === 0) {
      toast.error('Unable to generate words: no categories available');
      return;
    }

    console.log('Categories:', JSON.stringify(categories, null, 2)); // Debug log

    setIsGenerating(true);

    const wordsPerParticipant = 3;
    const totalWords = participants.length * wordsPerParticipant;
    const wordsPerCategory = Math.ceil(totalWords / categories.length);

    try {
      for (const category of categories) {
        if (!category.id) {
          console.error('Invalid category:', category);
          continue;
        }
        console.log('Generating for category:', JSON.stringify(category, null, 2)); // Debug log
        await generateForAllCategories.mutateAsync({
          categoryId: category.id,
          gameRoomId: gameId as string,
          count: wordsPerCategory,
        });
      }
      toast.success('✨ Magic words generated successfully!');
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate magic words');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearAll = () => {
    if (!gameId) {
      toast.error('Invalid game ID');
      return;
    }
    clearAllMagicWords.mutate(
      { gameRoomId: gameId as string },
      {
        onSuccess: () => {
          toast.success('✨ All magic words cleared!');
          void refetchMagicWords();
          setIsClearAllModalOpen(false);
        },
        onError: (error: any) => {
          toast.error(`Failed to clear magic words: ${error.message}`);
        }
      }
    );
  };

  const handleNext = () => {
    if (!hasEnoughWords) {
      toast.error(`Please add at least 3 magic words per participant (${requiredWords} total needed)`);
      return;
    }
    if (gameId && typeof gameId === 'string') {
      void router.push(`/game/${gameId}/game-results`);
    }
  };

  // Calculate required words
  const requiredWords = participants ? participants.length * 3 : 0;
  const currentWords = magicWords?.length ?? 0;
  const hasEnoughWords = currentWords >= requiredWords;

  return {
    word,
    setWord,
    selectedCategoryId,
    setSelectedCategoryId,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    magicWordToDelete,
    setMagicWordToDelete,
    isClearAllModalOpen,
    setIsClearAllModalOpen,
    isGenerating,
    participants,
    magicWords,
    categories,
    isLoadingMagicWords,
    isLoadingCategories,
    requiredWords,
    currentWords,
    hasEnoughWords,
    gameId,
    handleSubmit,
    handleDelete,
    confirmDelete,
    handleGenerateWithAI,
    handleClearAll,
    handleNext,
    isAddingWord: addMagicWord.isPending,
  };
};

import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';
import { TRPCClientError, TRPCClientErrorLike } from '@trpc/client';
import { useCallback, useState } from 'react';
import type { AssignmentWithRelations } from '~/server/router/types';

export const useGameResults = () => {
  const router = useRouter();
  const { gameId } = router.query;
  const [isPostGenerationLoading, setIsPostGenerationLoading] = useState(false);

  const utils = api.useContext();

  const { data: assignments, isLoading: isLoadingAssignments } =
    api.assignment.getResults.useQuery<AssignmentWithRelations[]>(
      { gameRoomId: gameId as string },
      {
        enabled: Boolean(gameId) && typeof gameId === 'string',
        retry: false,
        staleTime: 0,
      }
    );

  const generateAssignments = api.assignment.generateAssignments.useMutation<AssignmentWithRelations[]>({
    onSuccess: async (newAssignments) => {
      setIsPostGenerationLoading(true);
      await utils.assignment.getResults.invalidate({ gameRoomId: gameId as string });
      toast.success('✨ Assignments generated successfully!', {
        duration: 6000,
      });
      setIsPostGenerationLoading(false);
    },
    onError: (error: TRPCClientErrorLike<any>) => {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to generate assignments');
      }
    },
  });

  const generateGiftIdeas = api.assignment.generateGiftIdeas.useMutation({
    onSuccess: async () => {
      await utils.assignment.getResults.invalidate({ gameRoomId: gameId as string });
    },
  });

  const generateGiftImages = api.assignment.generateGiftImages.useMutation({
    onSuccess: async () => {
      await utils.assignment.getResults.invalidate({ gameRoomId: gameId as string });
    },
  });

  const generateAllGiftIdeasMutation = api.assignment.generateAllGiftIdeas.useMutation({
    onSuccess: async () => {
      await utils.assignment.getResults.invalidate({ gameRoomId: gameId as string });
    },
  });

  const generateAllGiftImagesMutation = api.assignment.generateAllGiftImages.useMutation({
    onSuccess: async () => {
      await utils.assignment.getResults.invalidate({ gameRoomId: gameId as string });
    },
  });

  const resetGiftGenerationMutation = api.assignment.resetGiftGeneration.useMutation({
    onSuccess: async () => {
      await utils.assignment.getResults.invalidate({ gameRoomId: gameId as string });
    },
  });

  const generateAllGiftIdeas = useCallback(async () => {
    if (!gameId) return;
    console.info('🎁 Starting gift idea generation for game:', gameId);
    await generateAllGiftIdeasMutation.mutateAsync({ gameRoomId: gameId as string });
  }, [gameId, generateAllGiftIdeasMutation]);

  const generateAllGiftImages = useCallback(async () => {
    if (!gameId) return;
    console.info('🎨 Starting gift image generation for game:', gameId);
    await generateAllGiftImagesMutation.mutateAsync({ gameRoomId: gameId as string });
  }, [gameId, generateAllGiftImagesMutation]);

  const handleGenerateAssignments = useCallback(async (generateAssignmentsFn: (params: { gameRoomId: string }) => Promise<void>) => {
    if (!gameId) return;

    try {
      await generateAssignmentsFn({ gameRoomId: gameId as string });
      await generateAllGiftIdeas();

      // Wait 1 second before generating gift images
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await generateAllGiftImages();
    } catch (error) {
      console.error('Error generating assignments:', error);
      toast.error('Failed to generate assignments. Please try again.');
    }
  }, [gameId, generateAllGiftIdeas, generateAllGiftImages]);

  const handleRetryGeneration = useCallback(async () => {
    if (!gameId) return;
    try {
      await resetGiftGenerationMutation.mutateAsync({ gameRoomId: gameId as string });
      await generateAllGiftIdeas();

      // Wait 1 second before generating gift images
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await generateAllGiftImages();
      toast.success('Gift generation restarted successfully!');
    } catch (error) {
      console.error('Failed to retry gift generation:', error);
      toast.error('Failed to retry gift generation. Please try again.');
    }
  }, [gameId, resetGiftGenerationMutation, generateAllGiftIdeas]);

  return {
    assignments,
    isLoadingAssignments,
    isPostGenerationLoading,
    generateAssignments,
    generateGiftIdeasForAssignment: generateGiftIdeas.mutateAsync,
    generateGiftImagesForAssignment: generateGiftImages.mutateAsync,
    generateAllGiftIdeas,
    generateAllGiftImages,
    handleGenerateAssignments,
    handleRetryGeneration,
    isGeneratingAssignments: generateAssignments.isPending,
    isGeneratingIdeas: generateAllGiftIdeasMutation.isPending,
    isGeneratingImages: generateAllGiftImagesMutation.isPending,
  };
};

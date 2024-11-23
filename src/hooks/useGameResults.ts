import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';
import { TRPCClientError, TRPCClientErrorLike } from '@trpc/client';
import { useEffect } from 'react';

export const useGameResults = () => {
  const router = useRouter();
  const { gameId } = router.query;

  const utils = api.useContext();

  const { data: assignments, isLoading: isLoadingAssignments } =
    api.assignment.getResults.useQuery(
      { gameRoomId: gameId as string },
      {
        enabled: Boolean(gameId) && typeof gameId === 'string',
        retry: false,
        staleTime: 0,
      }
    );

  const generateAssignments = api.assignment.generateAssignments.useMutation({
    onSuccess: () => {
      toast.success('✨ Assignments generated successfully!');
      // Invalidate the assignments query to trigger a refresh
      void utils.assignment.getResults.invalidate({ gameRoomId: gameId as string });
    },
    onError: (error: TRPCClientErrorLike<any>) => {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to generate assignments');
      }
    },
  });

  // Error handling for assignments query
  useEffect(() => {
    if (assignments === undefined && !isLoadingAssignments) {
      toast.error('Failed to load assignments');
    }
  }, [assignments, isLoadingAssignments]);

  const handleGenerateAssignments = () => {
    if (!gameId || typeof gameId !== 'string') {
      toast.error('Invalid game ID');
      return;
    }

    generateAssignments.mutate({ gameRoomId: gameId });
  };

  const handleBack = () => {
    if (gameId && typeof gameId === 'string') {
      void router.push(`/game/${gameId}/magic-words`);
    }
  };

  return {
    // Data
    assignments,
    isLoadingAssignments,
    isGenerating: generateAssignments.isPending,
    gameId,

    // Handlers
    handleGenerateAssignments,
    handleBack,
  };
};

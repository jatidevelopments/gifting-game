import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';

export const useParticipants = () => {
  const router = useRouter();
  const { gameId } = router.query;

  const [newParticipant, setNewParticipant] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: participants, isLoading: isLoadingParticipants, refetch: refetchParticipants } = 
    api.participant.getAll.useQuery(
      { gameRoomId: gameId as string },
      { enabled: !!gameId }
    );

  const utils = api.useContext();

  const { mutate: addParticipant, mutateAsync: addParticipantAsync } = api.participant.create.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchParticipants(),
        utils.participant.getAll.invalidate({ gameRoomId: gameId as string })
      ]);
      toast.success('Participant added successfully! ');
      setNewParticipant('');
    },
    onError: (error: any) => {
      if (error.message.includes('Unique')) {
        toast.error('This name is already in use!');
      } else {
        toast.error(error.message);
      }
    }
  });

  const deleteParticipant = api.participant.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchParticipants(),
        utils.participant.getAll.invalidate({ gameRoomId: gameId as string })
      ]);
      toast.success('Participant deleted successfully!');
      setIsDeleteModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
      setIsDeleteModalOpen(false);
    }
  });

  const clearAllParticipants = api.participant.clearAllParticipants.useMutation({
    onSuccess: async () => {
      await Promise.all([
        refetchParticipants(),
        utils.participant.getAll.invalidate({ gameRoomId: gameId as string })
      ]);
      toast.success('All participants cleared successfully!');
      setIsClearAllModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
      setIsClearAllModalOpen(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newParticipant.trim() || !gameId) {
      return Promise.resolve();
    }

    await addParticipantAsync({
      gameRoomId: gameId as string,
      name: newParticipant.trim(),
    });
    
    return Promise.resolve();
  };

  const handleDelete = (participant: { id: string; name: string }) => {
    setParticipantToDelete(participant);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (participantToDelete && gameId) {
      deleteParticipant.mutate({
        id: participantToDelete.id,
        gameRoomId: gameId as string
      });
    }
  };

  const handleClearAll = () => {
    if (!gameId) {
      toast.error('Invalid game ID');
      return;
    }
    clearAllParticipants.mutate({ gameRoomId: gameId as string });
  };

  const handleNext = () => {
    if (!participants?.length) {
      toast.error('Please add at least one participant');
      return;
    }
    if (gameId && typeof gameId === 'string') {
      void router.push(`/game/${gameId}/magic-words`);
    }
  };

  return {
    // State
    newParticipant,
    setNewParticipant,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isClearAllModalOpen,
    setIsClearAllModalOpen,
    participantToDelete,

    // Data
    participants,
    isLoadingParticipants,
    gameId,

    // Handlers
    handleSubmit,
    handleDelete,
    confirmDelete,
    handleClearAll,
    handleNext,
  };
};

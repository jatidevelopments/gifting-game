import { useState } from 'react';
import { z } from 'zod';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';

const PinSchema = z.string().min(4).max(8);

export const useAssignment = (id: string | undefined) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // Get assignment data
  const { data: assignment, isLoading } = api.assignment.getAssignment.useQuery(
    { accessUrl: id! },
    { enabled: typeof window !== 'undefined' && !!id }
  );

  // Verify PIN mutation
  const verifyPinMutation = api.participant.verifyPin.useMutation({
    onSuccess: () => {
      setIsVerified(true);
      setError('');
      toast.success('PIN verified successfully!', {
        icon: '🔓',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
      setIsVerified(false);
    },
  });

  // Set PIN mutation
  const setPinMutation = api.participant.setPin.useMutation({
    onSuccess: () => {
      setIsVerified(true);
      setError('');
      toast.success('PIN set successfully!', {
        icon: '🔒',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    },
  });

  // Handle PIN submission
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;

    try {
      PinSchema.parse(pin);

      if (assignment.gifter.hasAccessed) {
        await verifyPinMutation.mutateAsync({
          participantId: assignment.gifter.id,
          pin,
        });
      } else {
        await setPinMutation.mutateAsync({
          participantId: assignment.gifter.id,
          pin,
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError('PIN must be between 4 and 8 characters');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  // Handle reveal button click
  const handleReveal = () => {
    setIsRevealed(true);
    toast.success('Assignment revealed! 🎁', {
      icon: '🎄',
      duration: 3000,
    });
  };

  // Toggle PIN visibility
  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  return {
    // State
    pin,
    error,
    isVerified,
    showPin,
    isRevealed,
    assignment,
    isLoading,

    // Setters
    setPin,
    setError,
    setIsVerified,
    setShowPin,
    setIsRevealed,

    // Handlers
    handlePinSubmit,
    handleReveal,
    togglePinVisibility,
  };
};

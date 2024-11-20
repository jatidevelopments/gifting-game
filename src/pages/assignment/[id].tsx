import { trpc } from '../../utils/trpc';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { z } from 'zod';

const PinSchema = z.string().min(4).max(8);

export default function AssignmentView() {
  const router = useRouter();
  const { id } = router.query;
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const { data: assignment, isLoading } = trpc.assignment.getAssignment.useQuery(
    { accessUrl: id as string },
    { enabled: !!id }
  );

  const verifyPinMutation = trpc.participant.verifyPin.useMutation({
    onSuccess: () => {
      setIsVerified(true);
      setError('');
    },
    onError: (error) => {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
      setIsVerified(false);
    },
  });

  const setPinMutation = trpc.participant.setPin.useMutation({
    onSuccess: () => {
      setIsVerified(true);
      setError('');
    },
    onError: (error) => {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
      setIsVerified(false);
    },
  });

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      PinSchema.parse(pin);
    } catch (err) {
      setError('PIN must be between 4 and 8 characters');
      return;
    }

    if (!assignment) return;

    try {
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
      // Error is already handled by the mutation's onError callback
      return;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white">Loading...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-4 text-red-200">
          <p>Assignment not found</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8"
        >
          <h1 className="text-3xl font-christmas text-red-400 mb-6 text-center">
            🎄 Welcome {assignment.gifter.name}! 🎁
          </h1>
          
          <p className="text-gray-200 mb-6 text-center">
            {assignment.gifter.hasAccessed
              ? "Enter your PIN to view your gift assignment"
              : "Set a PIN to view your gift assignment. Remember this PIN as you'll need it to view your assignment again!"}
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (4-8 characters)"
                className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-colors ${
                  error ? 'border-red-400/50' : 'border-white/10'
                }`}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 bg-red-400/10 backdrop-blur-sm rounded-lg px-3 py-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={setPinMutation.isPending || verifyPinMutation.isPending}
              className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg text-green-300 flex items-center justify-center gap-2"
            >
              {(setPinMutation.isPending || verifyPinMutation.isPending) ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>{assignment.gifter.hasAccessed ? "View Assignment" : "Set PIN"}</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8"
      >
        <h1 className="text-4xl font-christmas text-red-400 mb-8 text-center">
          🎁 Your Gift Assignment 🎄
        </h1>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl text-gray-200 mb-2">You are gifting to:</h2>
            <h3 className="text-4xl font-christmas text-green-400">
              {assignment.receiver.name}
            </h3>
          </div>

          <div className="text-center">
            <h2 className="text-2xl text-gray-200 mb-4">Make it something...</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[assignment.adjective1, assignment.adjective2, assignment.adjective3].map((adj) => (
                <motion.span
                  key={adj.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-lg text-red-300"
                >
                  {adj.word}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm">
            <p>Remember your PIN to view this assignment again later!</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

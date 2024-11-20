import { NextPage } from 'next';
import { client as api } from '../../trpc/server';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { z } from 'zod';

const PinSchema = z.string().min(4).max(8);

const AssignmentPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const { data: assignment, isLoading } = api.assignment.getAssignment.useQuery(
    { accessUrl: id as string },
    { enabled: typeof window !== 'undefined' && !!id }
  );

  const verifyPinMutation = api.participant.verifyPin.useMutation({
    onSuccess: () => {
      setIsVerified(true);
      setError('');
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

  const setPinMutation = api.participant.setPin.useMutation({
    onSuccess: () => {
      setIsVerified(true);
      setError('');
    },
    onError: (error: any) => {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    },
  });

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-white">Assignment not found</div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 rounded-lg bg-white/5 p-8 shadow-lg"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Welcome, {assignment.gifter.name}!
            </h2>
            <p className="mt-2 text-white/70">
              {assignment.gifter.hasAccessed
                ? 'Please enter your PIN to view your assignment'
                : 'Please set a PIN to protect your assignment'}
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="pin" className="sr-only">
                PIN
              </label>
              <div className="relative">
                <input
                  id="pin"
                  name="pin"
                  type={showPin ? 'text' : 'password'}
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter PIN (4-8 characters)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPin ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {assignment.gifter.hasAccessed ? 'Verify PIN' : 'Set PIN'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8 rounded-lg bg-white/5 p-8 shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Your Gift Assignment</h2>
          <p className="mt-4 text-lg text-white/70">
            You are gifting to:
            <span className="ml-2 text-2xl font-bold text-white">
              {assignment.receiver.name}
            </span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white/10 p-6">
            <h3 className="text-xl font-semibold text-white">Gift Suggestions</h3>
            <div className="mt-4 space-y-2">
              {[assignment.adjective1, assignment.adjective2, assignment.adjective3].map((adj) => (
                <div
                  key={adj.id}
                  className="rounded bg-white/5 px-3 py-2 text-white"
                >
                  {adj.word}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AssignmentPage;
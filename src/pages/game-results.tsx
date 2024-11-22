import type { NextPage } from 'next';
import { TRPCClientError } from '@trpc/client';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useClipboard } from '../hooks/useClipboard';
import { client as api } from '../trpc/server';
import Link from 'next/link';

const GameResults: NextPage = (props) => {
  const { data: assignments, error, refetch } = api.assignment.getResults.useQuery();
  const generateAssignments = api.assignment.generateAssignments.useMutation({
    onSuccess: () => {
      void refetch();
      toast.success('Assignments generated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const { copyToClipboard } = useClipboard();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopyLink = async (accessUrl: string, participantName: string) => {
    const fullUrl = `${baseUrl}/assignment/${accessUrl}`;
    await copyToClipboard(fullUrl);
    toast.success(`Link copied for ${participantName}!`);
  };

  const handleGenerateAssignments = () => {
    void generateAssignments.mutate();
  };

  if (error instanceof TRPCClientError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-4 text-red-200">
          <p>Error: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center"
        >
          <h2 className="text-3xl font-christmas text-red-400 mb-4">No Results Yet</h2>
          <p className="text-gray-200 mb-8">
            Add some participants and magic words first, then generate your gift exchange!
          </p>
          <button
            onClick={handleGenerateAssignments}
            disabled={generateAssignments.isPending}
            className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg text-red-300 flex items-center gap-2 mx-auto"
          >
            {generateAssignments.isPending ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Generate Assignments</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-christmas text-red-400 mb-4">
          🎁 Gift Exchange Results 🎄
        </h1>
        <p className="text-gray-400 mb-8">Share these links with your participants to reveal their assignments!</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <Link
          href="/magic-words"
          className="w-full sm:w-auto inline-flex items-center px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Magic Words
        </Link>
        <button
          onClick={handleGenerateAssignments}
          disabled={generateAssignments.isPending}
          className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {generateAssignments.isPending ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Regenerating...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Regenerate Assignments</span>
            </>
          )}
        </button>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {assignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-christmas text-green-400 mb-2">
                    {assignment.gifter.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Share this link to reveal their gift assignment
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      void handleCopyLink(assignment.accessUrl, assignment.gifter.name);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-green-500/20 hover:bg-green-500/30 transition-colors rounded-lg text-green-300 flex items-center justify-center gap-2"
                  >
                    <span>Copy Link</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                  <Link
                    href={`/assignment/${assignment.accessUrl}`}
                    className="flex-1 sm:flex-none px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 transition-colors rounded-lg text-purple-300 flex items-center justify-center gap-2"
                  >
                    <span>Preview</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameResults;

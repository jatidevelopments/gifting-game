import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, ShareIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface CopyLinkButtonProps {
  gameCode: string;
  currentPage: 'participants' | 'magic-words' | 'game-results';
}

export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ gameCode, currentPage }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Generate the URL based on the current page
      const baseUrl = `${window.location.origin}/game/${gameCode}`;
      let pageUrl: string;
      let message = "Join our magical gift exchange! 🎁✨\n\n";
      
      switch (currentPage) {
        case 'participants':
          pageUrl = `${baseUrl}/participants`;
          message += "We're gathering participants for a special gift exchange. Click the link to join:";
          break;
        case 'magic-words':
          pageUrl = `${baseUrl}/magic-words`;
          message += "We're adding magical words to make our gift exchange special. Join us:";
          break;
        case 'game-results':
          pageUrl = `${baseUrl}/game-results`;
          message += "Our gift exchange is ready! Click to see your secret gift recipient:";
          break;
        default:
          pageUrl = `${baseUrl}/participants`;
          message += "Join our Secret Santa gift exchange:";
      }
      
      const fullMessage = `${message}\n${pageUrl}`;
      await navigator.clipboard.writeText(fullMessage);
      
      setCopied(true);
      toast.success('Game link copied to clipboard!', {
        icon: '✨',
        style: {
          background: '#1a1f35',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link. Please try again.');
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        onClick={handleCopy}
        className="
          relative group
          bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700
          text-white px-4 py-2 rounded-lg
          shadow-[0_0_15px_rgba(168,85,247,0.3)]
          hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]
          transition-all duration-300
          flex items-center gap-2
          overflow-hidden
          font-cinzel
          border border-purple-500/20
        "
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background sparkle effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, transparent 60%)',
          }}
          initial={false}
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="copied"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <CheckIcon className="w-5 h-5" />
              <span className="font-medium">Copied!</span>
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <ShareIcon className="w-5 h-5" />
              <span className="font-medium">Share Game</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

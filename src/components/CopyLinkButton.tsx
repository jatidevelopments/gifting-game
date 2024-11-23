import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, ShareIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

type GameLinkButtonProps = {
  gameCode: string;
  currentPage: 'participants' | 'magic-words' | 'game-results';
};

type AssignmentLinkButtonProps = {
  onClick: () => Promise<void>;
  disabled?: boolean;
};

export type CopyLinkButtonProps = GameLinkButtonProps | AssignmentLinkButtonProps;

const isGameLinkProps = (props: CopyLinkButtonProps): props is GameLinkButtonProps => {
  return 'gameCode' in props && 'currentPage' in props;
};

export const CopyLinkButton: React.FC<CopyLinkButtonProps> = (props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (isGameLinkProps(props)) {
        // Generate the URL based on the current page
        const baseUrl = `${window.location.origin}/game/${props.gameCode}`;
        let pageUrl: string;
        let message = "Join our magical gift exchange! 🎁✨\n\n";
        
        switch (props.currentPage) {
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
      } else {
        await props.onClick();
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link. Please try again.', {
        style: {
          background: '#1a1f35',
          color: '#ff4e4e',
          border: '1px solid rgba(255,78,78,0.2)',
        },
      });
    }
  };

  const isDisabled = !isGameLinkProps(props) && props.disabled;

  return (
    <motion.button
      onClick={handleCopy}
      disabled={isDisabled}
      className={`group relative px-4 py-2 bg-gradient-to-r from-purple-500/20 to-red-500/20 
        rounded-lg text-white/90 hover:from-purple-500/30 hover:to-red-500/30 
        transition-all flex items-center gap-2 border border-purple-500/20
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-500/20 
        disabled:hover:to-red-500/20`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <CheckIcon className="h-5 w-5" />
            <span>Copied!</span>
          </motion.div>
        ) : (
          <motion.div
            key="share"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <ShareIcon className="h-5 w-5" />
            <span>Copy Link</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
